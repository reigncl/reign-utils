export const once = <T, A extends any[]>(
  fn: (...args: A) => T,
  kfind: (...args: A) => string | number | Symbol = (...args) =>
    JSON.stringify(args),
  cache: Map<string | number | Symbol, T> = new Map()
) => (...args: A): T => {
  const key = kfind(...args);

  if (!cache.has(key)) {
    const v = fn(...args);
    cache.set(key, v);
    return v;
  }

  return cache.get(key) as T;
};
