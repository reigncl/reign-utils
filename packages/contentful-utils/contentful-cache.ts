import type { ContentfulClientApi, Entry } from 'contentful'
import { CacheSystem } from './types/cache-system';
import { createPaginateItems } from './paginate-items';
import { Cache } from './lib/cache';
import ms from 'ms';
import debug from 'debug';

const log = debug('contentful-utils:cache');

const contentfulCacheDefaultTTL = process.env.CONTENTFUL_CACHE_DEFAULT_TTL ?? '20 minutes';

const msTosSecond = (ms: number) => Math.round(ms / 1000);

function hashQuery(query: any) {
    return JSON.stringify(query);
}

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
    queryCache: CacheSystem;

    constructor(readonly options: ContentfulCacheOptions<F>) {
        const createSystemCache = options.createSystemCache ?? ContentfulCache.defaultCreateCacheSystem;

        this.queryCache = createSystemCache();
        this.entriesCache = createSystemCache();
        this.assetsCache = createSystemCache();

        options.fieldIndexable?.forEach(field => {
            this.fieldsCache.set(field, createSystemCache());
        });
    };

    private async * getEntriesWithoutCache<T extends { [k in F]: any }>(hash: string, query: any) {
        log(`Fetching query: %o`, query);

        const newCached: Entry<any>[] = [];

        for await (const entry of createPaginateItems<Entry<T>>((q) => this.options.client.getEntries(q))(query)) {
            this.putEntryCache(entry);
            newCached.push(entry);
            yield entry;
        }

        this.queryCache.set(hash, newCached);

        return;
    }

    async *getEntries<T extends { [k in F]: any }>(query: any) {
        const hash = hashQuery(query);
        const cached = await this.queryCache.get<Entry<T>[]>(hash);
        if (cached) {
            yield* cached;
            return;
        }

        yield* this.getEntriesWithoutCache(hash, query);
        return;
    }

    async *getEntriesByField<T extends { [k in F]: any }>(field: F, valuesIn: any[], getEntriesQuery?: any) {
        const fieldCache = this.fieldsCache.get(field);
        if (!fieldCache) {
            throw new Error(`Field ${field} not found in cache`);
        }

        const itemsCached = await fieldCache.mget<Entry<T>>(valuesIn)

        for (const value of Object.values(itemsCached)) {
            if (value) {
                yield value;
            }
        }

        const valuesNoCached = valuesIn.filter(value => itemsCached[value] === undefined);

        if (valuesNoCached.length) {
            log(`${valuesNoCached.length} items not found in cache`);
            const p = createPaginateItems(q => this.options.client.getEntries<T>(q))

            const query = { ...getEntriesQuery, [`fields.${field}[in]`]: valuesNoCached.join(',') }

            log(`Fetching query: %o`, query);

            for await (const entry of p(query)) {
                this.putEntryCache(entry);
                yield entry;
            }
        }
    }

    putEntryCache(entry: Entry<any>) {
        this.entriesCache.set(entry.sys.id, entry);
        Array.from(this.fieldsCache.entries()).forEach(([field, cache]) => {
            if (entry.fields && entry.fields[field]) {
                cache.set(entry.fields[field], entry);
            }
        });
    }

    static defaultCreateCacheSystem = (): CacheSystem => new Cache({ stdTTL: msTosSecond(ms(contentfulCacheDefaultTTL)) });
}
