"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var crypto_1 = require("crypto");
var url_1 = __importDefault(require("url"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var storage = (_a = globalThis.localStorage, (_a !== null && _a !== void 0 ? _a : {}));
exports.helperStateValue = function (prefix) {
    if (prefix === void 0) { prefix = ''; }
    var keyState = prefix + "_clientoauth2_state";
    var state = storage[keyState];
    if (state)
        return state;
    var newState = crypto_1.randomBytes(16).toString('hex');
    storage[keyState] = newState;
    return newState;
};
exports.helperStorage = function (prefix) {
    if (prefix === void 0) { prefix = ''; }
    var resultMemory = {};
    var setProp = function (prop) { return Object.defineProperty(resultMemory, prop, {
        enumerable: true,
        get: function () { return storage[prefix + "_clientoauth2_" + prop]; },
        set: function (v) { storage[prefix + "_clientoauth2_" + prop] = v; },
    }); };
    setProp('access_token');
    setProp('refresh_token');
    return resultMemory;
};
var ClientOAuth2 = /** @class */ (function () {
    function ClientOAuth2(opts) {
        var _a, _b, _c, _d, _e, _f, _g;
        this.prefixMemory = (_a = opts.prefixMemory, (_a !== null && _a !== void 0 ? _a : ''));
        this.clientId = opts.clientId;
        this.clientSecret = opts.clientSecret;
        this.tokenUri = opts.tokenUri;
        this.authorizationUri = opts.authorizationUri;
        this.refreshUri = (_b = opts.refreshUri, (_b !== null && _b !== void 0 ? _b : this.tokenUri));
        this.scope = opts.scope;
        this.redirectUri = (_c = opts.redirectUri, (_c !== null && _c !== void 0 ? _c : (_e = (_d = globalThis) === null || _d === void 0 ? void 0 : _d.location) === null || _e === void 0 ? void 0 : _e.href));
        this.state = (_f = opts.state, (_f !== null && _f !== void 0 ? _f : exports.helperStateValue(this.prefixMemory)));
        this.storage = (_g = opts.storage, (_g !== null && _g !== void 0 ? _g : exports.helperStorage(this.prefixMemory)));
        if (this.storage.access_token) {
            this.currentUser = jsonwebtoken_1.default.decode(this.storage.access_token);
        }
    }
    ClientOAuth2.prototype.getAutorizationUri = function () {
        var _a = url_1.default.parse(this.authorizationUri, true), query = _a.query, auth = _a.auth, host = _a.host, path = _a.path, href = _a.href, urlParsed = __rest(_a, ["query", "auth", "host", "path", "href"]);
        var paramsQuery = {
            response_type: 'code',
            state: this.state,
            client_id: this.clientId,
            scope: this.scope,
            redirect_uri: this.redirectUri,
        };
        var uri = url_1.default.format(__assign(__assign({}, urlParsed), { query: __assign(__assign({}, query), paramsQuery) }));
        return { uri: uri, paramsQuery: paramsQuery };
    };
    ClientOAuth2.prototype.getToken = function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var dataToken, timeNextRefresh;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this.storage.access_token) return [3 /*break*/, 3];
                        dataToken = jsonwebtoken_1.default.decode(this.storage.access_token);
                        timeNextRefresh = (((_a = dataToken) === null || _a === void 0 ? void 0 : _a.exp) * 1000) - 30000;
                        if (!(timeNextRefresh < Date.now())) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.exchangeRefreshToken()];
                    case 1:
                        _b.sent();
                        _b.label = 2;
                    case 2: return [2 /*return*/, this.storage.access_token];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ClientOAuth2.prototype.exchangeRefreshToken = function () {
        var _this = this;
        if (this.exchangeRefreshTokenMemory) {
            return this.exchangeRefreshTokenMemory;
        }
        var p = this.runExchangeRefreshToken();
        p
            .then(function (res) {
            _this.currentUser = jsonwebtoken_1.default.decode(res.access_token);
            _this.storage.access_token = res.access_token;
            _this.storage.refresh_token = res.refresh_token;
        })
            .finally(function () {
            _this.exchangeRefreshTokenMemory = undefined;
        });
        this.exchangeRefreshTokenMemory = p;
        return this.exchangeRefreshTokenMemory;
    };
    ClientOAuth2.prototype.runExchangeRefreshToken = function () {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var res, body, token_type, expires_in, access_token, scope, refresh_token, body_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, fetch(this.refreshUri, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                grant_type: 'refresh_token',
                                refresh_token: this.storage.refresh_token,
                                // scope: this.storage.scope,
                                client_id: this.clientId,
                                client_secret: this.clientSecret,
                            }),
                        })];
                    case 1:
                        res = _c.sent();
                        return [4 /*yield*/, res.json()];
                    case 2:
                        body = _c.sent();
                        token_type = body.token_type;
                        expires_in = body.expires_in;
                        access_token = body.access_token;
                        scope = body.scope;
                        refresh_token = body.refresh_token;
                        if (!!res.status.toString().startsWith('2')) return [3 /*break*/, 4];
                        return [4 /*yield*/, res.json()];
                    case 3:
                        body_1 = _c.sent();
                        throw new Error((_b = (_a = body_1) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.message);
                    case 4: return [2 /*return*/, {
                            token_type: token_type,
                            expires_in: expires_in,
                            access_token: access_token,
                            scope: scope,
                            refresh_token: refresh_token,
                        }];
                }
            });
        });
    };
    ClientOAuth2.prototype.exchangeCode = function (code) {
        var _this = this;
        if (this.exchangeCodeMemory) {
            return this.exchangeCodeMemory;
        }
        var p = this.runExchangeCode(code);
        p
            .then(function (res) {
            _this.currentUser = jsonwebtoken_1.default.decode(res.access_token);
            _this.storage.access_token = res.access_token;
            _this.storage.refresh_token = res.refresh_token;
        })
            .finally(function () {
            _this.exchangeCodeMemory = undefined;
        });
        this.exchangeCodeMemory = p;
        return this.exchangeCodeMemory;
    };
    ClientOAuth2.prototype.runExchangeCode = function (code) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var res, body_2, body, token_type, expires_in, access_token, scope, refresh_token;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, fetch(this.tokenUri, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                grant_type: 'authorization_code',
                                code: code,
                                client_id: this.clientId,
                                client_secret: this.clientSecret,
                                redirect_uri: this.redirectUri,
                            }),
                        })];
                    case 1:
                        res = _c.sent();
                        if (!!res.status.toString().startsWith('2')) return [3 /*break*/, 3];
                        return [4 /*yield*/, res.json()];
                    case 2:
                        body_2 = _c.sent();
                        throw new Error((_b = (_a = body_2) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.message);
                    case 3: return [4 /*yield*/, res.json()];
                    case 4:
                        body = _c.sent();
                        token_type = body.token_type;
                        expires_in = body.expires_in;
                        access_token = body.access_token;
                        scope = body.scope;
                        refresh_token = body.refresh_token;
                        return [2 /*return*/, {
                                token_type: token_type,
                                expires_in: expires_in,
                                access_token: access_token,
                                scope: scope,
                                refresh_token: refresh_token,
                            }];
                }
            });
        });
    };
    return ClientOAuth2;
}());
exports.ClientOAuth2 = ClientOAuth2;
