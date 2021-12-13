import { createClient } from "contentful"
import { ContentfulCache } from "./contentful-cache"
import { createMockClient } from "./lib/createMockClient"

describe('contentful-cache', () => {

    it('should get entries by fields', async () => {

        const client = createMockClient();
        // const client = createClient({
        // })


        const c = new ContentfulCache({ client, fieldIndexable: ['refid', 'name'] })

        for await (const entry of c.getEntriesByField('refid', ['5_9_451', '5_9_612'], { content_type: 'cupon' })) {
            // console.log(entry)
        }

        for await (const entry of c.getEntriesByField('refid', ['5_9_451', '5_9_812'], { content_type: 'cupon' })) {
            // console.log(entry)
        }
    })

})