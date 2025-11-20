export * from './date.js';
export * from './file.js';
export * from './string.js';

/**
 * Returns the property value from an object at the given dot-delimited string path (e.g., `key1.key2.key3`).
 * @param {Record<string, unknown>} object
 * @param {string} keyPath
 * @returns {unknown}
 */
export function get(object, keyPath) {
  const keys = keyPath.split('.');
  return keys.reduce((subObject, key) => {
    return subObject[key];
  }, object);
}

/**
 * Memoizes the given function, caching its result.
 */
export function memoize(fn) {
  const cache = new Map();

  return function (...args) {
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
