export interface CacheSystem {
    set(key: string, value: any): Promise<boolean>;
    del(key: string | string[]): Promise<boolean>;
    get<T>(key: string): Promise<T | undefined>;
    mget<T>(keys: string[]): Promise<{ [key: string]: T | undefined; }>;
}
