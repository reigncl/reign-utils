# Worker Threads

**How to use:**

```ts
import throng from '@reignmodule/throng';

const runServer = () => { ... }

throng(runServer);
// Server ready on port 3000
// Server ready on port 3000
// Server ready on port 3000
// Server ready on port 3000
```

## Options

Change option with the second property of `throng`.

```ts
throng(runServer, {
  workers: number,
});
```

- **workers** *(`number`)*: Define workers to work, by default use `os.cpus().length`.
