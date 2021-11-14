const lodash = require('lodash');
const sass = require('sass');
const dayjs = require('dayjs');
const markdownLib = require('../plugins/markdown');
const site = require('../../src/_data/site');
const { throwIfNotType } = require('../utils');

/** Returns the first `limit` elements of the the given array. */
const limit = (array, limit) => {
  if (limit < 0) {
    throw new Error(`Negative limits are not allowed: ${limit}.`);
  }
  return array.slice(0, limit);
};

/** Sorts the given array of objects by a string denoting chained key paths. */
const sortByKey = (arrayOfObjects, keyPath, order = 'ASC') => {
  const sorted = lodash.sortBy(arrayOfObjects, (object) => lodash.get(object, keyPath));
  if (order === 'ASC') return sorted;
  if (order === 'DESC') return sorted.reverse();
  throw new Error(`Invalid sort order: ${order}`);
};

/** Returns all entries from the given array that match the specified key:value pair. */
const where = (arrayOfObjects, keyPath, value) =>
  arrayOfObjects.filter((object) => lodash.get(object, keyPath) === value);

/** Returns the word count of the given string. */
const wordCount = (str) => {
  throwIfNotType(str, 'string');
  const matches = str.match(/[\w\d’'-]+/gi);
  return matches?.length ?? 0;
};

/** Converts the given markdown string to HTML, returning it as a string. */
const toHtml = (markdownString) => {
  return markdownLib.renderInline(markdownString);
};

/** Divides the first argument by the second. */
const dividedBy = (numerator, denominator) => {
  if (denominator === 0) {
    throw new Error(`Cannot divide by zero: ${numerator} / ${denominator}`);
  }
  return numerator / denominator;
};

/** Replaces every newline with a line break. */
const newlineToBr = (str) => {
  throwIfNotType(str, 'string');
  return str.replace(/\n/g, '<br>');
};

/** Removes every newline from the given string. */
const stripNewlines = (str) => {
  throwIfNotType(str, 'string');
  return str.replace(/\n/g, '');
};

/** Removes all tags from an HTML string. */
const stripHtml = (str) => {
  throwIfNotType(str, 'string');
  return str.replace(/<[^>]+>/g, '');
};

/** Formats the given string as an absolute url. */
const toAbsoluteUrl = (url) => {
  throwIfNotType(url, 'string');
  // Replace trailing slash, e.g., site.com/ => site.com
  const siteUrl = site.url.replace(/\/$/, '');
  // Replace starting slash, e.g., /path/ => path/
  const relativeUrl = url.replace(/^\//, '');

  return `${siteUrl}/${relativeUrl}`;
};

/** Converts the given date string to ISO8610 format. */
const toISOString = (dateString) => dayjs(dateString).toISOString();

/**
 * @param {*} collection - an array of collection items that are assumed to have either data.lastUpdated or a date property
 * @returns the most recent date of update or publication among the given collection items, or undefined if the array is empty.
 */
const getLatestCollectionItemDate = (collection) => {
  const itemsSortedByLatestDate = collection
    .filter((item) => !!item.data?.lastUpdated || !!item.date)
    .sort((item1, item2) => {
      const date1 = item1.data?.lastUpdated ?? item1.date;
      const date2 = item2.data?.lastUpdated ?? item2.date;
      if (dayjs(date1).isAfter(date2)) {
        return -1;
      }
      if (dayjs(date2).isAfter(date1)) {
        return 1;
      }
      return 0;
    });
  const latestItem = itemsSortedByLatestDate[0];
  return latestItem?.data?.lastUpdated ?? latestItem?.date;
};

// TODO: deprecate this once Liquid supports keyword arguments for shortcodes: https://github.com/11ty/eleventy/issues/1263
const jsonParse = (jsonString) => {
  let jsonObject;
  // DANGER! But I trust myself and only ever call this method with my own data.
  // This is the only way to get around the fact that the JSON string passed in
  // may break due to trailing commas (e.g., see image.html include that uses Liquid `if` tags).
  eval(`jsonObject = ${jsonString};`);
  return JSON.parse(JSON.stringify(jsonObject));
};

/** Given a scss string, compile it to CSS, minify the result, and return the final CSS as a string. */
const compileAndMinifyScss = (scss) => {
  return sass.renderSync({ data: scss, outputStyle: 'compressed' }).css.toString();
};

module.exports = {
  limit,
  sortByKey,
  where,
  wordCount,
  toHtml,
  toISOString,
  dividedBy,
  newlineToBr,
  stripNewlines,
  stripHtml,
  toAbsoluteUrl,
  jsonParse,
  getLatestCollectionItemDate,
  compileAndMinifyScss,
};
