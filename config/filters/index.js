const lodash = require('lodash');
const dayjs = require('dayjs');
const markdownLib = require('../plugins/markdown');
const site = require('../../src/_data/site');

/** Returns the first `limit` elements of the the given array. */
const limit = (array, limit) => {
  if (limit < 0) {
    throw new Error(`${limit.name}: negative limits are not allowed: ${limit}.`);
  }
  return array.slice(0, limit)
}

/** Sorts the given array of objects by a string denoting chained key paths. */
const sortByKey = (arrayOfObjects, keyPath, order = 'ASC') => {
  const sorted = lodash.sortBy(arrayOfObjects, (object) => lodash.get(object, keyPath));
  if (order === 'ASC') return sorted;
  if (order === 'DESC') return sorted.reverse();
  throw new Error(`${sortByKey.name}: invalid sort order: ${order}`);
};

/** Returns all entries from the given array that match the specified key:value pair. */
const where = (arrayOfObjects, keyPath, value) =>
  arrayOfObjects.filter((object) => lodash.get(object, keyPath) === value);

/** Returns the word count of the given string. */
const wordCount = (str) => {
  if (typeof str !== 'string') {
    throw new Error(`${wordCount.name}: expected argument of type string but instead got ${str} (${typeof str})`);
  }
  const matches = str.match(/[\w\d’'-]+/gi);
  return matches?.length ?? 0;
}

/** Converts the given markdown string to HTML, returning it as a string. */
const toHtml = (markdownString) => {
  return markdownLib.renderInline(markdownString);
};

/** Escapes special characters in the given string. */
const escape = (string) => lodash.escape(string);

/** Converts the given value to JSON format. */
const jsonify = (value) => JSON.stringify(value);

/** Divides the first argument by the second. */
const dividedBy = (numerator, denominator) => {
  if (denominator === 0) {
    throw new Error(`${dividedBy.name}: cannot divide by zero: ${numerator} / ${denominator}`);
  }
  return numerator / denominator;
}

/** Replaces every newline with a line break. */
const newlineToBr = (str) => {
  if (typeof str !== 'string') {
    throw new Error(`${newlineToBr.name}: expected argument of type string but instead got ${url} (${typeof url})`);
  }
  return str.replace(/\n/g, '<br>');
};

/** Removes every newline from the given string. */
const stripNewlines = (str) => {
  if (typeof str !== 'string') {
    throw new Error(`${stripNewlines.name}: expected argument of type string but instead got ${str} (${typeof str})`);
  }
  return str.replace(/\n/g, '');
};

/** Removes all tags from an HTML string. */
const stripHtml = (str) => {
  if (typeof str !== 'string') {
    throw new Error(`${stripHtml.name}: expected argument of type string but instead got ${str} (${typeof str})`);
  }
  return str.replace(/<[^>]+>/g,'');
};

/** Formats the given string as an absolute url. */
const toAbsoluteUrl = (url) => {
  if (typeof url !== 'string') {
    throw new Error(`${toAbsoluteUrl.name}: expected argument of type string but instead got ${url} (${typeof url})`);
  }
  // Replace trailing slash, e.g., site.com/ => site.com
  const siteUrl = site.url.replace(/\/$/, '');
  // Replace starting slash, e.g., /path/ => path/
  const relativeUrl = url.replace(/^\//, '');

  return `${siteUrl}/${relativeUrl}`;
}

/** Converts the given date string to ISO8610 format. */
const toISOString = (dateString) => dayjs(dateString).toISOString();

module.exports = {
  limit,
  sortByKey,
  where,
  wordCount,
  toHtml,
  escape,
  jsonify,
  toISOString,
  dividedBy,
  newlineToBr,
  stripNewlines,
  stripHtml,
  toAbsoluteUrl,
};
