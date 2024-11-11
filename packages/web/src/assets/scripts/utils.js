/**
 * Returns a new function that invokes `func` no more than once per `rateMs` milliseconds.
 * @param {(...args: unknown[]) => void} func
 * @param {number} rateMs
 */
export function throttle(func, rateMs) {
  let lastInvocationTimeMs = null;

  return function (...args) {
    const nowMs = Date.now();
    if (nowMs - lastInvocationTimeMs >= rateMs) {
      func(...args);
      lastInvocationTimeMs = nowMs;
    }
  };
}
