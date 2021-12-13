interface GetItems<T> {
    (query: Record<string, any>): Promise<{
        items: T[];
    }>;
}
/**
 * Automatically get the next page of items from a query.
 */
export declare function createPaginateItems<T>(getItems: GetItems<T>): (query?: Record<string, any> | undefined) => AsyncGenerator<Awaited<T>, void, undefined>;
export {};
