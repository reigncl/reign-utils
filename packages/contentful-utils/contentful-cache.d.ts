import { ContentfulClientApi, Entry } from 'contentful';
import Cache from 'node-cache';
interface ContentfulCacheOptions<F> {
    client: ContentfulClientApi;
    fieldIndexable?: F[];
    cacheOptions?: Cache.Options;
}
export declare class ContentfulCache<F extends string> {
    readonly options: ContentfulCacheOptions<F>;
    entriesCache: Cache;
    assetsCache: Cache;
    fieldsCache: Map<F, Cache>;
    constructor(options: ContentfulCacheOptions<F>);
    getEntriesByField<T extends {
        [k in F]: any;
    }>(field: F, valuesIn: any[], getEntriesQuery?: any): AsyncGenerator<Entry<T>, void, undefined>;
}
export {};
