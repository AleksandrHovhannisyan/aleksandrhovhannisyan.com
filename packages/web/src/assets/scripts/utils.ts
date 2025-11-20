/**
 * Returns a new function that invokes `func` no more than once per `rateMs` milliseconds.
 * @param callback The function to call.
 * @param rateMs At most, `callback` will only ever run once per this period of time.
 */
export function throttle(callback: (...args: unknown[]) => void, rateMs: number) {
  let isWaiting = false;
  // Args for the most recent invocation that was queued/skipped. When the timer goes off, we want to invoke the callback with these args.
  let mostRecentlyQueuedArgs: unknown[] | null = null;

  return (...args: unknown[]) => {
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

/**
 * Takes a newline-delimited JSON stream and yields one parsed line at a time.
 * @param response The response object from the server. Assumed to be in ndjson format.
 */
export async function* parseStream<ChunkType>(response: Response) {
  const decoder = new TextDecoder();
  let buffer = '';

  for await (const value of response.body) {
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');

    // Save last chunk. It's either 1) empty string because it was last line's trailing newline, in which case we're done on next iteration of while loop,
    // or 2) an incomplete chunk, in which case we will complete it on the next iteration of the while loop when the server sends the remainder.
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (line.trim()) {
        yield JSON.parse(line) as ChunkType;
      }
    }
  }
}
