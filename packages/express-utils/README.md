# express services utilities
Common express services utilities


## `listeningListener()`

```ts
listeningListener(this: ServerHttp): void
```

Use it to show a listener server.

**Sample:**

```ts
import { listeningListener } from '@reignmodule/express-utils';

createServerHttp(app).listen(3000, listeningListener);
// Server ready on http://localhost:3000
createServerHttps(app).listen(3001, listeningListener);
// Server ready on https://localhost:3001
createServerHttp2(app).listen(3002, listeningListener);
// Server ready on //localhost:3002
```

![preview](https://i.imgur.com/2kSt7A3.png "SHELL: $ node index.js")


## `requestHandlerAsync`

```ts
requestHandlerAsync(requestHandler: (req: Request, res: Response, next: NextFunction) => Promise<any>, thisArg?: any) => RequestHandler
```

**Sample**

```ts
const app = express();

app.get('/', requestHandlerAsync(async (req, res) => {
  res.send('ok');
}));
```


## `errorRequestHandlerAsync`

```ts
errorRequestHandlerAsync(errorRequestHandler: (error: any, req: Request, res: Response, next: NextFunction) => Promise<any>, thisArg?: any) => ErrorRequestHandler
```

**Sample**

```ts
const app = express();

app.get('/', errorRequestHandlerAsync(async (err, req, res) => {
  res.status(500).send(err.message);
}));
```


## `requestParamHandlerAsync`

```ts
requestParamHandlerAsync(requestParamHandler: (req: Request, res: Response, next: NextFunction, value: any, name: string) => Promise<any>, thisArg?: any) => RequestParamHandler
```

**Sample**

```ts
const app = express();

app.param('user', requestParamHandlerAsync(async (req, res, next, id, param) => {
  const user = await User.find(id);
  req.user = user;
  return next();
}));
```
