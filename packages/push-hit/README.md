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
- **enabled** (_`boolean`_, **Optional**, Default: `true`): If is `false` ignore send messages.
- **environment** (_`string`_, **Optional**, Default: `process.env.NODE_ENV`): Default is `process.env`.
- **target** (_`string`_, **Optional**):
- **inervalPush** (_`string`_, **Optional**, Default: `"5s"`): Time to wait the next sent.
- **indexDateStrategy** (*`boolean`*, **Optional**, Default: `true`): Use to index with date strategy, Ej. _index = `abc` => _index = `abc-2020.01.01`.
- **indexDateTimeZone** (*`string`*, **Optional**, Default: `America/Santiago`): Use to define the timezone. See [List of tz database time zones](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones).
- **indexDateFormat** (*`string`*, **Optional**, Default: `"YYYY.MM.DD"`):
