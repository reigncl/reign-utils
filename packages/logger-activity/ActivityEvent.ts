
export enum Action {
    Register = 'Register',
    Login = 'Login',
    CouponAction = 'CouponAction',
    UserUpdated = 'UserUpdated'
}

export enum TypeUserUpdated {
    email = 'email',
    phone = 'phone',
    pass = 'pass',
    other = 'other'
}

export enum TypeCouponAction {
    activated = 'activated',
    used = 'used',
    accumulated = 'accumulated',
    deleted = 'deleted'
}

type Lat = number;
type Lng = number;
/** Order [ Lat, Lng ] */
type LLPosition = [Lat, Lng];

export interface ActivityEvent {
    action: Action;
    typeUserUpdated?: TypeUserUpdated;
    typeCouponAction?: TypeCouponAction;
    geoIdOffer?: string;
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
}
