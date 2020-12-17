# @reignmodule/logger-activity

![NPM Publish package logger-activity](https://github.com/reigncl/reign-utils/workflows/NPM%20Publish%20package%20logger-activity/badge.svg)

Message structure to send to Cloudwatch.

## How to use

Install with [npm](https://www.npmjs.com/).

```sh
$ npm i @reignmodule/logger-activity
```

Import `@reignmodule/logger-activity` in your code.

```ts
import { LoggerActivity, Action } from "@reignmodule/logger-activity";
import { AwsCloudWatch } from "@reignmodule/logger-activity/AwsCloudWatch";

const log = LoggerActivity.createLogger({
  loggerMessage: AwsCloudWatch.getInstance({
    awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
    awsRegion: process.env.AWS_REGION,
    awsSecretKey: process.env.AWS_SECRET_ACCESS_KEY,
    logGroupName: "mi_logs_groups",
  }),
});

log.sendMessage({
  action: Action.Login,
  clientId: "abc",
  formatId: "123",
  location: {
    city: "W",
    countryCode: "12",
    regionCode: "CW",
    position: [1, 2],
  },
});
```
