"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const contentful_cache_1 = require("./contentful-cache");
const createMockClient_1 = require("./lib/createMockClient");
describe('contentful-cache', () => {
    it('should get entries by fields', () => __awaiter(void 0, void 0, void 0, function* () {
        var e_1, _a, e_2, _b;
        const client = (0, createMockClient_1.createMockClient)();
        // const client = createClient({
        // })
        const c = new contentful_cache_1.ContentfulCache({ client, fieldIndexable: ['slug', 'name'] });
        try {
            for (var _c = __asyncValues(c.getEntriesByField('slug', ['article/23', 'article/12'], { content_type: 'cupon' })), _d; _d = yield _c.next(), !_d.done;) {
                const entry = _d.value;
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) yield _a.call(_c);
            }
            finally { if (e_1) throw e_1.error; }
        }
        try {
            for (var _e = __asyncValues(c.getEntriesByField('slug', ['article/43', 'article/8'], { content_type: 'cupon' })), _f; _f = yield _e.next(), !_f.done;) {
                const entry = _f.value;
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_f && !_f.done && (_b = _e.return)) yield _b.call(_e);
            }
            finally { if (e_2) throw e_2.error; }
        }
    }));
});
