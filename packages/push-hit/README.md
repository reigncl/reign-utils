# push-hit

Simple client to sent messages at web services.

## Example

```ts
const pushHit = createPushHit({
  baseUrl: `http://my-hit-server:3000`,
  inervalPush: '2ms'
});

pushHit.push({
  _index: 'abc',
  myData,
});
```

## API `createPushHit(Options)`

**Options:**

- **baseUrl** (_`string`_): Url base to send messages.
- **enabled** (_`boolean`_, **Optional**): If is `false` ignore send messages.
- **environment** (_`string`_, **Optional**): Default is `process.env`.
- **target** (_`string`_, **Optional**):
- **inervalPush** (_`string`_, **Option**): Time to wait the next sent.


