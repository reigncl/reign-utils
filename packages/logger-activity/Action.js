"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeCouponAction = exports.TypeUserUpdated = exports.Action = void 0;
var Action;
(function (Action) {
    Action["Register"] = "Register";
    Action["Login"] = "Login";
    Action["CouponAction"] = "CouponAction";
    Action["UserUpdated"] = "UserUpdated";
})(Action = exports.Action || (exports.Action = {}));
var TypeUserUpdated;
(function (TypeUserUpdated) {
    TypeUserUpdated["email"] = "email";
    TypeUserUpdated["phone"] = "phone";
    TypeUserUpdated["pass"] = "pass";
    TypeUserUpdated["other"] = "other";
})(TypeUserUpdated = exports.TypeUserUpdated || (exports.TypeUserUpdated = {}));
var TypeCouponAction;
(function (TypeCouponAction) {
    TypeCouponAction["activated"] = "activated";
    TypeCouponAction["used"] = "used";
    TypeCouponAction["accumulated"] = "accumulated";
    TypeCouponAction["deleted"] = "deleted";
})(TypeCouponAction = exports.TypeCouponAction || (exports.TypeCouponAction = {}));
