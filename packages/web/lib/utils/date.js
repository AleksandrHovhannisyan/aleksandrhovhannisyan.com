function makeRelativeTimeStringGetter() {
  const cutoffSeconds = [60, 3600, 86400, 86400 * 7, 86400 * 30, 86400 * 365, Infinity];
  /** @type {Intl.RelativeTimeFormatUnit[]} */
  const units = ['second', 'minute', 'hour', 'day', 'week', 'month', 'year'];
  const relativeTimeFormatter = new Intl.RelativeTimeFormat('en-US', { numeric: 'auto' });

  return function (date, now = new Date()) {
    // In Liquid templates, dates might be passed in as strings, so always construct new Date instances to be safe
    const timeMs = new Date(date).getTime();
    const nowMs = new Date(now).getTime();
    const deltaSeconds = Math.round((timeMs - nowMs) / 1000);

    const unitIndex = cutoffSeconds.findIndex((cutoff) => cutoff > Math.abs(deltaSeconds));
    const divisor = unitIndex ? cutoffSeconds[unitIndex - 1] : 1;
    return relativeTimeFormatter.format(Math.round(deltaSeconds / divisor), units[unitIndex]);
  };
}

/**
 * Interprets the given date object as a human-readable relative time string.
 * @param {Date|string} date The date to compare against `now`.
 * @param {Date|string} now The current date to compare against (defaults to `new Date()`, i.e. the Date corresponding to `Date.now()`)
 * @credit Lewis J Ellis https://gist.github.com/LewisJEllis/9ad1f35d102de8eee78f6bd081d486ad
 */
export const getRelativeTimeString = makeRelativeTimeStringGetter();
