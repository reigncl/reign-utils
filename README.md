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
