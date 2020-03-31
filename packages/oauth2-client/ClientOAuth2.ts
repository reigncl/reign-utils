import url from 'url';
import jsonwebtoken from 'jsonwebtoken';
import bent from 'bent';

interface OptsClientOauth2 {
  authorizationUri: string;
  tokenUri: string;
  /** Prefix to helper functions */
  prefixMemory?: string;
  clientId?: string;
  clientSecret?: string;
  refreshUri?: string;
  scope?: string;
  state?: string;
  redirectUri?: string;
  storage?: StorageDrive;
}

type ExchangeOption = {
  code: string;
  response_type: 'code';
  state?: string;
  [k: string]: any;
};

export class StorageDrive {
  constructor(
    private prefix: string = '',
    private storeInstance: any = globalThis?.localStorage ?? {},
  ) { }

  getItem(keyValue: string): string | undefined {
    return this.storeInstance[`${this.prefix}${keyValue}`] ?? undefined;
  }

  setItem(keyValue: string, value: any) {
    this.storeInstance[`${this.prefix}${keyValue}`] = value.toString();
  }
}

interface Token {
  exp?: number;
  [k: string]: any;
}

export class ClientOAuth2<T extends Token = {}> {
  private exchangeRefreshTokenMemory?: ReturnType<ClientOAuth2['runExchangeRefreshToken']>;
  private exchangeCodeMemory?: ReturnType<ClientOAuth2['runExchangeCode']>;

  constructor(
    private opts: OptsClientOauth2,
  ) { }

  readonly prefixMemory = this.opts.prefixMemory ?? undefined;
  readonly storage = new StorageDrive(this.prefixMemory);
  readonly clientId = this.opts.clientId;
  readonly clientSecret = this.opts.clientSecret;
  readonly tokenUri = this.opts.tokenUri;
  readonly authorizationUri = this.opts.authorizationUri;
  readonly refreshUri = this.opts.refreshUri ?? this.tokenUri;
  public scope = this.opts.scope;
  readonly redirectUri = this.opts.redirectUri;
  readonly state = this.opts.state ?? (() => {
    const prevState = this.storage.getItem('state');

    if (prevState) return prevState;

    const nextState = Math.floor(Math.random() * 10 ** 17).toString();

    this.storage.setItem('state', nextState);

    return nextState;
  })();

  private _currentUser = (() => {
    const accessToken = this.storage.getItem('access_token');
    if (accessToken) {
      return jsonwebtoken.decode(accessToken) as T;
    }
  })();

  get currentUser() { return this._currentUser; }

  getAutorizationUri() {
    const { query, auth, host, path, href, ...urlParsed } = url.parse(this.authorizationUri, true, true);

    const paramsQuery = {
      response_type: 'code',
      state: this.state,
      client_id: this.clientId,
      scope: this.scope,
      redirect_uri: this.redirectUri,
    };

    const uri = url.format({
      ...urlParsed,
      query: {
        ...query,
        ...paramsQuery,
      },
    });

    return { uri, paramsQuery };
  }

  async getToken() {
    const accessToken = this.storage.getItem('access_token');

    if (accessToken) {
      const dataToken = jsonwebtoken.decode(accessToken) as T;

      if (typeof dataToken?.exp === 'number') {
        const timeNextRefresh = ((dataToken.exp ?? 1) * 1000) - 30000;

        if (timeNextRefresh < Date.now()) {
          await this.exchangeRefreshToken();
        }
      }

      return this.storage.getItem('access_token');
    }
  }

  exchangeRefreshToken() {
    if (this.exchangeRefreshTokenMemory) {
      return this.exchangeRefreshTokenMemory;
    }

    const promise = this.runExchangeRefreshToken();

    promise
      .then(res => {
        this._currentUser = jsonwebtoken.decode(res.access_token) as T;
        this.storage.setItem('access_token', res.access_token);
        this.storage.setItem('refresh_token', res.refresh_token);
      })
      .finally(() => {
        this.exchangeRefreshTokenMemory = undefined;
      });

    this.exchangeRefreshTokenMemory = promise;
    return this.exchangeRefreshTokenMemory;
  }

  private async runExchangeRefreshToken() {
    const body: any = await bent(this.refreshUri, 'json', 'POST', 201)(
      '',
      {
        grant_type: 'refresh_token',
        refresh_token: this.storage.getItem('refresh_token'),
        // scope: this.storage.scope,
        client_id: this.clientId,
        client_secret: this.clientSecret,
      },
    );

    const token_type: string = body.token_type;
    const expires_in: number = body.expires_in;
    const access_token: string = body.access_token;
    const scope: string = body.scope;
    const refresh_token: string = body.refresh_token;

    return {
      token_type,
      expires_in,
      access_token,
      scope,
      refresh_token,
    }
  }

  exchangeCode(code: string) {
    if (this.exchangeCodeMemory) {
      return this.exchangeCodeMemory;
    }

    const promise = this.runExchangeCode(code);

    promise
      .then((res) => {
        this._currentUser = jsonwebtoken.decode(res.access_token) as T;
        this.storage.setItem('access_token', res.access_token);
        this.storage.setItem('refresh_token', res.refresh_token);
      })
      .finally(() => {
        this.exchangeCodeMemory = undefined;
      });

    this.exchangeCodeMemory = promise;

    return this.exchangeCodeMemory;
  }

  private async runExchangeCode(code: string) {
    const body: any = await bent(this.tokenUri, 'json', 'POST', 201)(
      '',
      {
        grant_type: 'authorization_code',
        code: code,
        client_id: this.clientId,
        client_secret: this.clientSecret,
        redirect_uri: this.redirectUri,
      },
    );

    const token_type: string = body.token_type;
    const expires_in: number = body.expires_in;
    const access_token: string = body.access_token;
    const scope: string = body.scope;
    const refresh_token: string = body.refresh_token;

    return {
      token_type,
      expires_in,
      access_token,
      scope,
      refresh_token,
    }
  }

  exchange(opts: ExchangeOption) {
    const { response_type, state, code } = opts;

    if (state) {
      if (this.state !== state) {
        throw new Error(`State not match`);
      }
    }

    switch (response_type) {
      case 'code': return this.exchangeCode(code);
      default: throw new Error(`Response type ${opts.response_type} is not valid`);
    }
  }
}
