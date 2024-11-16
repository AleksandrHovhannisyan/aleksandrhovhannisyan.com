/**
 * Returns a new function that invokes `func` no more than once per `rateMs` milliseconds.
 * @param {(...args: unknown[]) => void} callback The function to call.
 * @param {number} rateMs At most, `callback` will only ever run once per this period of time.
 */
export function throttle(callback, rateMs) {
  let isWaiting = false;
  // Args for the most recent invocation that was queued/skipped. When the timer goes off, we want to invoke the callback with these args.
  let mostRecentlyQueuedArgs = null;

  return (...args) => {
    // Skip intermediate calls until the timer goes off, but keep track of the args so we don't drop off any calls after the timer.
    if (isWaiting) {
      mostRecentlyQueuedArgs = args;
      return;
    }

    callback(...args);
    isWaiting = true;

    // After rateMs passes, the next call will be eligible
    setTimeout(() => {
      isWaiting = false;
      // Run the most recently queued function call, if there is one
      if (mostRecentlyQueuedArgs) {
        callback(mostRecentlyQueuedArgs);
        mostRecentlyQueuedArgs = null;
      }
    }, rateMs);
  };
}
