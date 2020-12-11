export enum Action {
  Register = "Register",
  Login = "Login",
  CouponAction = "CouponAction",
  UserUpdated = "UserUpdated",
}

export enum TypeUserUpdated {
  email = "email",
  phone = "phone",
  pass = "pass",
  other = "other",
}

export enum TypeCouponAction {
  activated = "activated",
  used = "used",
  accumulated = "accumulated",
  deleted = "deleted",
}

type Lat = number;
type Lng = number;
/** Order [ Lat, Lng ] */
type LLPosition = [Lat, Lng];

export type ActivityEventBase = {
  clientId: string;
  formatId: string;
  storeId?: string;
  location: {
    city: string;
    countryCode: string;
    regionCode: string;
    position: LLPosition;
  };
  meta?: {
    headers?: {
      [k: string]: any;
    };
    [k: string]: any;
  };
};

export type ActivityEvent = ActivityEventBase &
  (
    | {
        action: Action.CouponAction;
        typeCouponAction: TypeCouponAction;
        geoIdOffer: string;
      }
    | {
        action: Action.Login | Action.Register;
      }
    | {
        action: Action.UserUpdated;
        typeUserUpdated: TypeUserUpdated;
      }
  );
