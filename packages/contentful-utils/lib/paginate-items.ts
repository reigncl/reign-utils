interface GetItems<T> {
    (query: Record<string, any>): Promise<{ items: T[] }>;
}

/**
 * Automatically get the next page of items from a query.
 */
export function createPaginateItems<T>(getItems: GetItems<T>) {
    return async function* paginateItems(query?: Record<string, any>) {
        let skip: undefined | number = 0;

        do {
            const items = await getItems({
                ...query,
                skip,
            });

            yield* items.items;

            if (items.items.length === 0) {
                break;
            }

            skip += items.items.length;
        } while (true);
    }
}

