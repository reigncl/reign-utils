export enum Action {
  Register = "Register",
  Login = "Login",
  RecoverPassword = "RecoverPassword",
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
  disabled?: boolean;
  clientId?: string;
  formatId?: string;
  userId?: string;
  storeId?: string;
  location?: {
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
  [prop: string]: any;
};

export type ActivityEvent = ActivityEventBase &
  (
    | {
        action: Action.CouponAction;
        typeCouponAction: TypeCouponAction;
        geoIdOffer: string;
      }
    | {
        action: Action.Login;
      }
    | {
        action: Action.Register;
      }
    | {
        action: Action.RecoverPassword;
      }
    | {
        action: Action.UserUpdated;
        typeUserUpdated: TypeUserUpdated;
      }
    | {
        action: string;
      }
  );
