
## Content ful cache

### Get entries by field value

**Sample:**

```ts
import { ContentfulCache } from '@reignmodule/contentful-utils/contentful-cache'

const client = contentful.createClient()

const contentfulCache = new ContentfulCache({ client, fieldIndexable: ['slug'] });

for await (const entry of c.getEntriesByField('slug', ['/home', '/article/123', '/article/456'])) {
    // ... do something with entry
}
```

