import { LoggerActivity, Action, TypeUserUpdated } from ".";
import { TypeCouponAction } from "./ActivityEvent";
import { AwsCloudWatch } from "./AwsCloudWatch";

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
  clientId: "",
  formatId: "",
  location: {
    city: "",
    countryCode: "",
    regionCode: "",
    position: [1, 2],
  },
});

log.sendMessage({
  action: Action.Register,
  clientId: "",
  formatId: "",
  location: {
    city: "",
    countryCode: "",
    regionCode: "",
    position: [1, 2],
  },
});

log.sendMessage({
  action: Action.CouponAction,
  geoIdOffer: "",
  typeCouponAction: TypeCouponAction.accumulated,
  clientId: "",
  formatId: "",
  location: {
    city: "",
    countryCode: "",
    regionCode: "",
    position: [1, 2],
  },
});

log.sendMessage({
  action: Action.UserUpdated,
  typeUserUpdated: TypeUserUpdated.email,
  clientId: "",
  formatId: "",
  location: {
    city: "",
    countryCode: "",
    regionCode: "",
    position: [1, 2],
  },
});

log.sendMessage({
  action: "custon action",
  clientId: "",
  formatId: "",
  location: {
    city: "",
    countryCode: "",
    regionCode: "",
    position: [1, 2],
  },
});
