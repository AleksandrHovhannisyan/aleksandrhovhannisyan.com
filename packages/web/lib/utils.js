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
      figure: ['class', 'data-language'],
      // Class for syntax highlighting; tabindex added by https://github.com/AleksandrHovhannisyan/markdown-it-code-tabindex
      code: ['class', 'tabindex'],
      // Prism outputs spans with class names for tokens
      span: ['class'],
      // Quotes
      blockquote: ['class'],
      // Code file names
      figcaption: ['class'],
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
export function memoize(fn) {
  const cache = new Map();

  return async function (...args) {
    const key = JSON.stringify(args);
    if (cache.get(key)) {
      return cache.get(key);
    }
    const value = await fn.apply(this, args);
    cache.set(key, value);
    return value;
  };
}

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
 * @param {Map<string, string>} keyMap
 * @returns {(str: string) => string}
 */
function makeStringEscaper(keyMap) {
  const replacementRegex = new RegExp(`[${Array.from(keyMap.keys()).join('')}]`, 'g');
  /**
   * @param {string} string
   */
  return function escape(string) {
    return string.replace(replacementRegex, (char) => keyMap.get(char));
  };
}

/** Escapes reserved characters as HTML entities. */
export const escape = makeStringEscaper(
  new Map([
    ['&', '&amp;'],
    ['<', '&lt;'],
    ['>', '&gt;'],
    ['"', '&quot;'],
    ["'", '&#39;'],
  ])
);

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
   * @param {Date|string} date The date to compare against `now`.
   * @param {Date|string} now The current date to compare against (defaults to `new Date()`, i.e. the Date corresponding to `Date.now()`)
   */
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
export const getRelativeTimeString = makeRelativeTimeStringGetter();
