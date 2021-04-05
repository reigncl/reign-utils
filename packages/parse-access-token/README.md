# Parse Access Token

Find the token from query object and header object.

**Sample with express:**

```ts
import e from 'express'
import parseAccessToken from '@reigncl/parse-access-token'

function myHandler(req: e.Request, res: e.Response) {
  const token = parseAccessToken(req)

  if (token === null) return res.status(401).send('Token not found');

  console.log(`Token: ${token}`);
  // code validation ...

  // ...
}
```
