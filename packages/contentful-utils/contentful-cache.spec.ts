import { createClient } from "contentful"
import { ContentfulCache } from "./contentful-cache"
import { createMockClient } from "./lib/createMockClient"

describe('contentful-cache', () => {

    it('should get entries by fields', async () => {

        const client = createMockClient() as any;
        // const client = createClient({
        // })


        const c = new ContentfulCache({ client, fieldIndexable: ['slug', 'name'] })

        for await (const entry of c.getEntriesByField('slug', ['article/23', 'article/12'], { content_type: 'cupon' })) {
            // console.log(entry)
        }

        for await (const entry of c.getEntriesByField('slug', ['article/43', 'article/8'], { content_type: 'cupon' })) {
            // console.log(entry)
        }
    })

})