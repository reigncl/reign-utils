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
export declare const helperStateValue: (prefix?: string) => any;
export declare const helperStorage: (prefix?: string) => Token;
export declare class ClientOAuth2 {
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
    private exchangeRefreshTokenMemory?;
    private exchangeCodeMemory?;
    constructor(opts: OptsClientOauth2);
    getAutorizationUri(): {
        uri: string;
        paramsQuery: {
            response_type: string;
            state: string | undefined;
            client_id: string | undefined;
            scope: string | undefined;
            redirect_uri: string | undefined;
        };
    };
    getToken(): Promise<any>;
    exchangeRefreshToken(): Promise<{
        token_type: string;
        expires_in: number;
        access_token: string;
        scope: string;
        refresh_token: string;
    }>;
    private runExchangeRefreshToken;
    exchangeCode(code: string): Promise<{
        token_type: string;
        expires_in: number;
        access_token: string;
        scope: string;
        refresh_token: string;
    }>;
    private runExchangeCode;
}
export {};
