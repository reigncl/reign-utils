# Worker Threads

**How to use:**

```ts
import throng from '@reignmodule/throng';

const workerRun = () => { ... }

throng(workerRun);
// Server ready on port 3000
// Server ready on port 3000
// Server ready on port 3000
// Server ready on port 3000
```

## Options

Change option with the second property of `throng`.

```ts
throng(() => void, { workers?: number, env?: any, }): Worker[] | undefined;
```

- **workers** *(`number`)*: Define workers to work, by default use `os.cpus().length`.
