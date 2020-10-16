# Latency CloudWatch Logs

Check latency of your functions.

## How to use

**1. Configure your environment**

> Prefer use dotenv module to read the environment from .env file.

Is required the next environments:

| Env | Desc |
| :--- | :--- |
| `LCWL_LOGGROUPNAME` | Use to define the logs groups on to store on cloudwatch |
| `npm_package_name` | This use to mark the origin in your log |
| `AWS_SECRET_ACCESS_KEY`| Required by aws credentias |
| `AWS_ACCESS_KEY_ID`| Required by aws credentias |

**2. Use of the singleton instance**

The next sample uses a single instance to check function.

```ts
import { latencyFunction } from "@reignmodule/latencycloudwatchlogs"

const result = await latencyFunction('myfn', () => fetch('https://api.ipify.org?format=json'))
```

This sends the log to CloudWatch as the next demo.

![image](https://user-images.githubusercontent.com/3086539/96214398-bf3ac700-0f51-11eb-9a25-d88dcca03b0b.png)


