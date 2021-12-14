import NodeCache from 'node-cache';
import { CacheSystem } from '../types/cache-system';


export class Cache implements CacheSystem {
    cache: NodeCache;

    constructor(options?: NodeCache.Options) {
        this.cache = new NodeCache(options);
    }

    async del(key: string | string[]) {
        this.cache.del(key);
        return true;
    }

    async get<T>(key: string) {
        return this.cache.get<T>(key);
    }

    async set(key: string, value: any) {
        return this.cache.set(key, value);
    }

    async mget<T>(keys: string[]) {
        return this.cache.mget<T>(keys);
    }
}
