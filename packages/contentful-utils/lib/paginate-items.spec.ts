import { createMockClient } from './createMockClient';
import { createPaginateItems } from './paginate-items';

describe('paginate items', () => {
    it('run sample', async () => {
        const fn = jest.fn();
        const client = createMockClient();

        const paginateItems = createPaginateItems(client.getEntries);

        for await (const entries of paginateItems()) {
            fn(entries);
        }

        expect(fn).toBeCalledTimes(100);
    })
})
