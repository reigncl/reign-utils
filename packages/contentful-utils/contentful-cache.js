"use strict";
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __asyncDelegator = (this && this.__asyncDelegator) || function (o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
};
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentfulCache = void 0;
const node_cache_1 = __importDefault(require("node-cache"));
const paginate_items_1 = require("./lib/paginate-items");
class ContentfulCache {
    constructor(options) {
        var _a;
        this.options = options;
        this.entriesCache = new node_cache_1.default(options.cacheOptions);
        this.assetsCache = new node_cache_1.default(options.cacheOptions);
        this.fieldsCache = new Map((_a = options.fieldIndexable) === null || _a === void 0 ? void 0 : _a.map(field => [field, new node_cache_1.default(options.cacheOptions)]));
    }
    ;
    getEntriesByField(field, valuesIn, getEntriesQuery) {
        return __asyncGenerator(this, arguments, function* getEntriesByField_1() {
            var e_1, _a;
            const fieldCache = this.fieldsCache.get(field);
            if (!fieldCache) {
                throw new Error(`Field ${field} not found in cache`);
            }
            const res = yield __await(fieldCache.mget(valuesIn));
            yield __await(yield* __asyncDelegator(__asyncValues(Object.values(res))));
            const itemsNotFound = valuesIn.filter(value => res[value] === undefined);
            if (itemsNotFound.length) {
                console.log(`${itemsNotFound.length} items not found in cache`);
                const p = (0, paginate_items_1.createPaginateItems)(q => this.options.client.getEntries(q));
                try {
                    for (var _b = __asyncValues(p(Object.assign(Object.assign({}, getEntriesQuery), { [`fields.${field}[in]`]: valuesIn.join(',') }))), _c; _c = yield __await(_b.next()), !_c.done;) {
                        const entry = _c.value;
                        this.entriesCache.set(entry.sys.id, entry);
                        const isRecord = (v) => typeof entry.fields === 'object' && entry.fields !== null;
                        const fields = entry.fields;
                        if (isRecord(fields)) {
                            Array.from(this.fieldsCache.entries()).forEach(([field, cache]) => {
                                if (fields[field]) {
                                    cache.set(fields[field], entry);
                                }
                            });
                        }
                        yield yield __await(entry);
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) yield __await(_a.call(_b));
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            }
        });
    }
}
exports.ContentfulCache = ContentfulCache;
