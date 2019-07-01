# services-utilities
Common services utilities


## `listeningListener()`

Use it to show a listener server.

**Sample:**

```ts
import { listeningListener } from '@reignmodule/utils';
import { createServer } from 'http';
import app from './app';

createServer(app)
  .listen(3000, listeningListener);
```

![preview](https://i.imgur.com/2kSt7A3.png "SHELL: $ node index.js")

## `Templates()`

Library to render views. this library is possible render views from contentful or static file.

### How to use

```typescript
import { Templates } from '@reignmodule/utils/utils/templates';

export const templates = new Templates({
  templates: {
    fromStaticFile: declareTemplate(
      `${__dirname}/view.ejs`,
    ),
    fromUri: declareTemplate(
      'https://assets.ctfassets.net/9ndydj6z4pcz/1tFWcvLW0w0C4nJaA0Kt5V/4ba163db3e380c418e9297f079bd84ae/activactionEmail.ejs',
    ),
    fromUriContentfull: declareTemplate(
      'https://preview.contentful.com/spaces/9ndydj6z4pcz/environments/master/entries/7Mu2Qxjb4pUHg2kmtJyBvx?access_token=TxK6B0loTaVeoNjlKxtSmqIh8JBHf6-awwf4HrQIzx4',
),
  },
});

// Render a view
templates.render('fromUriContentfull', {}) //: Promise<string>
```

### Assign type to render

Use `declareTemplate` to assign type into view.

```typescript
declareTemplate<{ title: string }>(`${__dirname}/view.ejs`);
```

```typescript
templates.render('fromStaticFile', { title: 'Hi!!' });
```

![sample template](https://i.imgur.com/4dGtWTL.png "Sample Template lib")
