declare type Token = string;
declare type BearerToken = `Bearer ${Token}`;
interface Query {
    access_token?: Token;
    key?: Token;
    [k: string]: any;
    [k: number]: any;
}
interface Headers {
    'x-api-key'?: Token;
    'authorization'?: Token | BearerToken;
    [k: string]: any;
    [k: number]: any;
}
declare type ReqObj = {
    query?: Query;
    headers?: Headers;
    [k: string]: any;
    [k: number]: any;
};
export declare const isString: (v: any) => v is string;
export declare const isBearerToken: (v: any) => v is `Bearer ${string}`;
export declare function parseAccessToken(opts: ReqObj): string | null;
export default parseAccessToken;
