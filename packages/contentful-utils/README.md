
## Content ful cache

### Get entries by field value

**Sample:**

```ts
import { ContentfulCache } from '@reignmodule/contentful-utils/contentful-cache'

const client = contentful.createClient()

const contentfulCache = new ContentfulCache({ client, fieldIndexable: ['slug'] });

// Get entries by field value
for await (const entry of contentfulCache.getEntriesByField('slug', ['/home', '/article/123', '/article/456'])) {
    // ... do something with entry. Time 500ms
}

// Second time, we can get the entries from cache
for await (const entry of contentfulCache.getEntriesByField('slug', ['/home', '/article/123', '/article/456'])) {
    // ... do something with entry. Time 10ms
}
```

### Get entries by query


**Sample:**

```ts
import { ContentfulCache } from '@reignmodule/contentful-utils/contentful-cache'

const client = contentful.createClient()

const contentfulCache = new ContentfulCache({ client, fieldIndexable: ['slug'] });

// Get entries by field value
for await (const entry of contentfulCache.getEntries({ content_type: 'articles', 'fields.type[in]': 'vip' })) {
    // ... do something with entry. Time 500ms
}
```


## Get all entries as async iterable

Transform the get entries method to an async generator.

**Example:**

```ts
import { createPaginateItems } from '@reignmodule/contentful-utils/paginate-items'

const client = contentful.createClient()

const paginateItems = createPaginateItems(client.getEntries);

// Get all entries
for await (const entries of paginateItems()) {
    // ... do something with entry
}
```
