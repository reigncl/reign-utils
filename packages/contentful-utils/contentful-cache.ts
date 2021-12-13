import { ContentfulClientApi, createClient, Entry } from 'contentful'
import Cache from 'node-cache';
import { createPaginateItems } from './lib/paginate-items';

interface ContentfulCacheOptions<F> {
    client: ContentfulClientApi;
    fieldIndexable?: F[];
    cacheOptions?: Cache.Options;
}

export class ContentfulCache<F extends string> {
    entriesCache: Cache;
    assetsCache: Cache;
    fieldsCache: Map<F, Cache>;

    constructor(readonly options: ContentfulCacheOptions<F>) {
        this.entriesCache = new Cache(options.cacheOptions);
        this.assetsCache = new Cache(options.cacheOptions);
        this.fieldsCache = new Map<F, Cache>(
            options.fieldIndexable?.map(field => [field, new Cache(options.cacheOptions)])
        );
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
}
