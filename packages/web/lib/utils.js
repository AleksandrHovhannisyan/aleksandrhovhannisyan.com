import sanitize from 'sanitize-html';
import slugify from 'slugify';
import path from 'node:path';
import site from '../src/_data/site.js';

/** Converts the given string to a slug form. */
export const slugifyString = (str) => {
  return slugify(str, {
    replacement: '-',
    remove: /[#,&,+()$~%.'":*?<>{}]/g,
    lower: true,
  });
};

/** Sanitizes an HTML string.
 * @param {string} html The HTML string to sanitize.
 * @returns {string}
 */
export const sanitizeHtml = (html) => {
  return sanitize(html, {
    // allow images
    allowedTags: sanitize.defaults.allowedTags.concat(['img']),
    allowedAttributes: {
      ...sanitize.defaults.allowedAttributes,
      // Class for syntax highlighting
      pre: ['class'],
      figure: ['class'],
      // Class for syntax highlighting; tabindex added by https://github.com/AleksandrHovhannisyan/markdown-it-code-tabindex
      code: ['class', 'tabindex'],
      // Prism outputs spans with class names for tokens
      span: ['class'],
      // Quotes
      blockquote: ['class'],
    },
  });
};

/**
 * @param {string} pathString
 */
export const withoutBaseDirectory = (pathString) => pathString.substring(pathString.indexOf(path.sep));

/**
 * Memoizes any function.
 * @param {() => Promise<any>} fn
 */
export const memoize = (fn) => {
  const cache = new Map();

  return async (...args) => {
    const key = JSON.stringify(args);
    if (cache.get(key)) {
      return cache.get(key);
    }
    const value = await fn.apply(this, args);
    cache.set(key, value);
    return value;
  };
};

/**
 * Interprets the given date object as a human-readable relative time string.
 * @credit Lewis J Ellis https://gist.github.com/LewisJEllis/9ad1f35d102de8eee78f6bd081d486ad
 */
function makeRelativeTimeStringGetter() {
  const cutoffSeconds = [60, 3600, 86400, 86400 * 7, 86400 * 30, 86400 * 365, Infinity];
  /** @type {Intl.RelativeTimeFormatUnit[]} */
  const units = ['second', 'minute', 'hour', 'day', 'week', 'month', 'year'];
  const relativeTimeFormatter = new Intl.RelativeTimeFormat(site.lang, { numeric: 'auto' });

  /**
   * @param {Date|string} date
   */
  return function (date) {
    const timeMs = new Date(date).getTime();
    const deltaSeconds = Math.round((timeMs - Date.now()) / 1000);
    const unitIndex = cutoffSeconds.findIndex((cutoff) => cutoff > Math.abs(deltaSeconds));
    const divisor = unitIndex ? cutoffSeconds[unitIndex - 1] : 1;
    return relativeTimeFormatter.format(Math.floor(deltaSeconds / divisor), units[unitIndex]);
  };
}
export const getRelativeTimeString = makeRelativeTimeStringGetter();
