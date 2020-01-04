# Client OAuth2

## How to install

```shell
npm install @reignmodule/oauth2-client
```

## Configure client OAuth2

```ts
import { ClientOAuth2 } from '@reignmodule/oauth2-client';

const client = new ClientOAuth2({
  authorizationUri: 'https://auth.sample/sigup',
  tokenUri: 'https://auth.sample/token',
  scope: 'profile users.write',
  clientId: '4f71bd80a86e3df3',
  clientSecret: '544fd3b90454f71303530379ee38',
  redirectUri: 'https://app.sample/complete_auth',
});
```

### Authorization Code Grant

**Get Authorization URI**

```ts
client.getAutorizationUri().uri;
// https://auth.sample/sigup
// ?response_type=code
// &state=7ca3c6082c56908bcfc9497b2d8c9371
// &client_id=4f71bd80a86e3df3
// &scope=profile%20users.write
// &redirect_uri=https%3A%2F%2Fapp.sample%2Fcomplete_auth
```

**HTML Form**

```jsx
<form method="GET" action="https://auth.sample/sigup">
  <input type="hidden" name="response_type" value="code"/>
  <input type="hidden" name="state" value={client.state}/>
  <input type="hidden" name="client_id" value={client.clientId}/>
  <input type="hidden" name="scope" value={client.scope}/>
  <input type="hidden" name="redirect_uri" value={client.redirectUri}/>
</form>
```

## Authorization Code Exchange

```ts
// URL: https://app.sample/complete_auth?state=7ca3c6082c56908bcfc9497b2d8c9371&code=7b2d8c9371
// queryState: 7ca3c6082c56908bcfc9497b2d8c9371
// queryCode: 7b2d8c9371

if (queryState!==client.state) {
  throw new Error('state no valid');
}

client.exchangeCode(code)
  .then(()=>{
    // Autorization done!!
  });
```
