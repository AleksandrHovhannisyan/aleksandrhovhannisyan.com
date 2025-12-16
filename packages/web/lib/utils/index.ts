export * from './date.ts';
export * from './file.ts';
export * from './string.ts';

/**
 * Returns the property value from an object at the given dot-delimited string path (e.g., `key1.key2.key3`).
 */
export function get(object: Record<string, unknown>, keyPath: string) {
  const keys = keyPath.split('.');
  return keys.reduce((subObject: { [x: string]: unknown }, key: string | number) => {
    return subObject[key];
  }, object);
}

/**
 * Memoizes the given function, caching its result.
 */
export function memoize(fn: (...args: unknown[]) => unknown) {
  const cache = new Map();

  return function (...args: unknown[]) {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key);
    }

    const value = fn.apply(this, args);

    // For async callbacks
    if (value instanceof Promise) {
      const promise = value.then((resolvedValue) => {
        // Once the promise resolves, cache the resolved value for future lookups
        cache.set(key, resolvedValue);
        return resolvedValue;
      });
      // In case there are multiple calls to the same promise, cache the promise itself
      // so that all redundant lookups return the same promise. Once it resolves, we'll update the cache above.
      cache.set(key, promise);
      return promise;
    }

    cache.set(key, value);
    return value;
  };
}
