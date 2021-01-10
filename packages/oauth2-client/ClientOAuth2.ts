import { randomBytes } from "crypto";
import url from 'url';
import jsonwebtoken from 'jsonwebtoken';
import fetch from 'node-fetch';
import { EventEmitter } from "events";

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

export interface ExchangeResult {
  token_type?: string;
  expires_in: number;
  access_token: string;
  scope?: string;
  refresh_token?: string;
}

declare global {
  interface ClientOAuth2Exchanges {
    code: (code: string) => Promise<ExchangeResult>;
    refreshToken: () => Promise<ExchangeResult>;
  }
}

type A<T> = T extends (...args: infer R) => any ? R : [];

interface ClientOAuth2Events {
  changeCurrentUser: [];
  refreshToken: [];
}

export class ClientOAuth2 {
  private eventEmitter = new EventEmitter()
  clientId?: string;
  clientSecret?: string;
  tokenUri: string;
  authorizationUri: string;
  refreshUri: string;
  scope?: string;
  redirectUri?: string;
  state: string;
  storage: Token | Storage;
  currentUser: any;
  prefixMemory: string;

  private workingExchangeMemory?: Promise<ExchangeResult>;
  private exchanges = new Map<string, (...args: any) => Promise<ExchangeResult>>();

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

    this.use('code', () => (code: string) => this.runExchangeCode(code));
    this.use('refreshToken', () => () => this.runExchangeRefreshToken());
  }

  on<T extends keyof ClientOAuth2Events>(event: T, listener: (...args: ClientOAuth2Events[T]) => void) {
    this.eventEmitter.once(event, listener as any);
  }
  once<T extends keyof ClientOAuth2Events>(event: T, listener: (...args: ClientOAuth2Events[T]) => void) {
    this.eventEmitter.once(event, listener as any);
  }
  removeAllListeners<T extends keyof ClientOAuth2Events>(event: T) {
    this.eventEmitter.removeAllListeners(event);
  }
  removeListener<T extends keyof ClientOAuth2Events>(event: T, listener: (...args: ClientOAuth2Events[T]) => void) {
    this.eventEmitter.removeListener(event, listener as any);
  }

  private emit<T extends keyof ClientOAuth2Events>(event: T, ...args: ClientOAuth2Events[T]) {
    this.eventEmitter.emit(event, ...args);
  }

  use<T extends keyof ClientOAuth2Exchanges>(exchangeName: T, exchange: (client: ClientOAuth2) => ClientOAuth2Exchanges[T]) {
    this.exchanges.set(exchangeName, exchange(this));
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

      const timeNextRefresh = (dataToken?.exp * 1000) - 30000;

      if (timeNextRefresh < Date.now()) {
        await this.exchangeRefreshToken();
        this.emit('refreshToken');
      }

      return this.storage.access_token;
    }
  }

  async exchange<T extends keyof ClientOAuth2Exchanges>(exchangeName: T, ...args: A<ClientOAuth2Exchanges[T]>) {
    if (this.workingExchangeMemory) {
      return this.workingExchangeMemory;
    }

    const exchange = this.exchanges.get(exchangeName)

    if (!exchange) throw new Error(`Cannot found exchange ${exchangeName}`)

    const p = exchange(...args);
    p
      .then(res => {
        this.currentUser = jsonwebtoken.decode(res.access_token);
        this.storage.access_token = res.access_token;
        this.storage.refresh_token = res.refresh_token;
        this.emit('changeCurrentUser');
      })
      .finally(() => {
        this.workingExchangeMemory = undefined;
      });
    this.workingExchangeMemory = p;

    return this.workingExchangeMemory;
  }

  exchangeCode(code: string) {
    return this.exchange('code', code);
  }

  exchangeRefreshToken() {
    return this.exchange('refreshToken');
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

    if (!res.status.toString().startsWith('2')) {
      const body = await res.json();
      throw new Error(`Error exchange: ${body?.error?.message ?? JSON.stringify(body)}`);
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
      throw new Error(`Error exchange: ${body?.error?.message ?? JSON.stringify(body)}`);
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
