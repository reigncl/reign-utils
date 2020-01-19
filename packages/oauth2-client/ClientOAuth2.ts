import getGlobalThis from 'globalthis';
import { randomBytes } from "crypto";
import url from 'url';
import jsonwebtoken from 'jsonwebtoken';

const globalThis = getGlobalThis();

interface Token {
  access_token?: string;
  refresh_token?: string;
}

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
  storage?: Token;
}

const storage = globalThis.localStorage ?? {};

export const helperStateValue = (prefix: string = '') => {
  const keyState = `${prefix}_clientoauth2_state`;
  const state = storage[keyState];

  if (state) return state;

  const newState = randomBytes(16).toString('hex');
  storage[keyState] = newState;

  return newState;
}

export const helperStorage = (prefix: string = ''): Token => {
  const resultMemory = {};

  const setProp = (prop: string) => Object.defineProperty(resultMemory, prop, {
    enumerable: true,
    get() { return storage[`${prefix}_clientoauth2_${prop}`]; },
    set(v) { storage[`${prefix}_clientoauth2_${prop}`] = v; },
  });

  setProp('access_token');
  setProp('refresh_token');

  return resultMemory;
}

export class ClientOAuth2 {
  clientId?: string;
  clientSecret?: string;
  tokenUri: string;
  authorizationUri: string;
  refreshUri: string;
  scope?: string;
  redirectUri?: string;
  state?: string;
  storage: Token | Storage;
  currentUser: any;
  prefixMemory: string;

  private exchangeRefreshTokenMemory?: ReturnType<ClientOAuth2['runExchangeRefreshToken']>;
  private exchangeCodeMemory?: ReturnType<ClientOAuth2['runExchangeCode']>;

  constructor(opts: OptsClientOauth2) {
    this.prefixMemory = opts.prefixMemory ?? '';
    this.clientId = opts.clientId;
    this.clientSecret = opts.clientSecret;
    this.tokenUri = opts.tokenUri;
    this.authorizationUri = opts.authorizationUri;
    this.refreshUri = opts.refreshUri ?? this.tokenUri;
    this.scope = opts.scope;
    this.redirectUri = opts.redirectUri ?? globalThis?.location?.href;
    this.state = opts.state ?? helperStateValue(this.prefixMemory);
    this.storage = opts.storage ?? helperStorage(this.prefixMemory);
    if (this.storage.access_token) {
      this.currentUser = jsonwebtoken.decode(this.storage.access_token);
    }
  }

  getAutorizationUri() {
    const { query, auth, host, path, href, ...urlParsed } = url.parse(this.authorizationUri, true);

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
    if (this.storage.access_token) {
      const dataToken = jsonwebtoken.decode(this.storage.access_token) as { [k: string]: any };

      if (dataToken?.exp) {
        const timeNextRefresh = (dataToken?.exp * 1000) - 30000;
        
        if (timeNextRefresh < Date.now()) {
          await this.exchangeRefreshToken();
        }
      }

      return this.storage.access_token;
    }
  }

  exchangeRefreshToken() {
    if (this.exchangeRefreshTokenMemory) {
      return this.exchangeRefreshTokenMemory;
    }

    const p = this.runExchangeRefreshToken();
    p
      .then(res => {
        this.currentUser = jsonwebtoken.decode(res.access_token);
        this.storage.access_token = res.access_token;
        this.storage.refresh_token = res.refresh_token;
      })
      .finally(() => {
        this.exchangeRefreshTokenMemory = undefined;
      });
    this.exchangeRefreshTokenMemory = p;
    return this.exchangeRefreshTokenMemory;
  }

  private async runExchangeRefreshToken() {
    const res = await fetch(this.refreshUri, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        grant_type: 'refresh_token',
        refresh_token: this.storage.refresh_token,
        // scope: this.storage.scope,
        client_id: this.clientId,
        client_secret: this.clientSecret,
      }),
    });

    const body = await res.json();

    const token_type: string = body.token_type;
    const expires_in: number = body.expires_in;
    const access_token: string = body.access_token;
    const scope: string = body.scope;
    const refresh_token: string = body.refresh_token;

    if (!res.status.toString().startsWith('2')) {
      const body = await res.json();
      throw new Error(body?.error?.message);
    }

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

    const p = this.runExchangeCode(code);
    p
      .then((res) => {
        this.currentUser = jsonwebtoken.decode(res.access_token);
        this.storage.access_token = res.access_token;
        this.storage.refresh_token = res.refresh_token;
      })
      .finally(() => {
        this.exchangeCodeMemory = undefined;
      });
    this.exchangeCodeMemory = p;

    return this.exchangeCodeMemory;
  }

  private async runExchangeCode(code: string) {
    const res = await fetch(this.tokenUri, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        code: code,
        client_id: this.clientId,
        client_secret: this.clientSecret,
        redirect_uri: this.redirectUri,
      }),
    });

    if (!res.status.toString().startsWith('2')) {
      const body = await res.json();
      throw new Error(body?.error?.message);
    }

    const body = await res.json();

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
}
