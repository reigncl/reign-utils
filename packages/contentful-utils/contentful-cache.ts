import type { ContentfulClientApi, Entry } from 'contentful'
import { CacheSystem } from './types/cache-system';
import { createPaginateItems } from './paginate-items';
import { Cache } from './lib/cache';

interface ContentfulCacheOptions<F> {
    client: ContentfulClientApi;
    fieldIndexable?: F[];
    createSystemCache?: () => CacheSystem;
}

/**
 * @example
 * declare const client: ContentfulClientApi;
 * 
 * const contentfulCache = new ContentfulCache({ client, fieldIndexable: ['slug'] });
 * 
 * // Get entries by field value
 * for await (const entry of contentfulCache.getEntriesByField('slug', ['/home', '/article/123', '/article/456'])) {
 *     // ... do something with entry. Time 500ms
 * }
 * 
 * // Second time, we can get the entries from cache
 * for await (const entry of contentfulCache.getEntriesByField('slug', ['/home', '/article/123', '/article/456'])) {
 *     // ... do something with entry. Time 10ms
 * }
 */
export class ContentfulCache<F extends string> {
    entriesCache: CacheSystem;
    assetsCache: CacheSystem;
    fieldsCache = new Map<F, CacheSystem>();

    constructor(readonly options: ContentfulCacheOptions<F>) {
        const createSystemCache = options.createSystemCache ?? ContentfulCache.defaultCreateCacheSystem;

        this.entriesCache = createSystemCache();
        this.assetsCache = createSystemCache();

        options.fieldIndexable?.forEach(field => {
            this.fieldsCache.set(field, createSystemCache());
        });
    };

    async *getEntriesByField<T extends { [k in F]: any }>(field: F, valuesIn: any[], getEntriesQuery?: any) {
        const fieldCache = this.fieldsCache.get(field);
        if (!fieldCache) {
            throw new Error(`Field ${field} not found in cache`);
        }

        const res = await fieldCache.mget<Entry<T>>(valuesIn)

        yield* Object.values(res);

        const itemsNotFound = valuesIn.filter(value => res[value] === undefined);

        if (itemsNotFound.length) {
            console.log(`${itemsNotFound.length} items not found in cache`);

            const p = createPaginateItems(q => this.options.client.getEntries<T>(q))

            for await (const entry of p({ ...getEntriesQuery, [`fields.${field}[in]`]: valuesIn.join(',') })) {
                this.entriesCache.set(entry.sys.id, entry);
                const isRecord = (v: any): v is Record<any, any> => typeof entry.fields === 'object' && entry.fields !== null
                const fields = entry.fields
                if (isRecord(fields)) {
                    Array.from(this.fieldsCache.entries()).forEach(([field, cache]) => {
                        if (fields[field]) {
                            cache.set(fields[field], entry);
                        }
                    });
                }
                yield entry;
            }
        }
    }

    static defaultCreateCacheSystem = (): CacheSystem => new Cache();
}
