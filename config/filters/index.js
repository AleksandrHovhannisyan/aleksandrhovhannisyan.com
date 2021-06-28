const lodash = require('lodash');
const dayjs = require('dayjs');
const markdownLib = require('../plugins/markdown');

/**
 * Filter to return all values from the given array where the path includes the specified value.
 * https://www.webstoemp.com/blog/basic-custom-taxonomies-with-eleventy/
 * @param {*} array
 * @param {*} path
 * @param {*} value
 */
const includes = (array, path, value) => {
  return array.filter((item) => {
    let pathValue = lodash.get(item, path);
    return pathValue.includes(value);
  });
};

/** Returns the first `limit` elements of the the given array. */
const limit = (array, limit) => array.slice(0, limit);

/** Removes the specified element from an array. */
const remove = (array, elementToRemove) => array.filter((element) => element !== elementToRemove);

/** Sots the given array of objects by a string denoting chained key paths. */
const sortByKey = (arrayOfObjects, keyPath, order = 'ASC') => {
  const sorted = lodash.sortBy(arrayOfObjects, (object) => lodash.get(object, keyPath));
  if (order === 'ASC') return sorted;
  return sorted.reverse();
};

/** Returns all entries from the given array that match the specified key:value pair. */
const where = (arrayOfObjects, keyPath, value) =>
  arrayOfObjects.filter((object) => lodash.get(object, keyPath) === value);

/** Returns the word count of the given string. */
const wordCount = (str) => str.split(' ').length;

/** Returns the  */
const toHtml = (markdownString) => {
  return markdownLib.renderInline(markdownString);
};

/** Escapes special characters in the given string. */
const escape = (string) => lodash.escape(string);

/** Converts the given value to JSON format. */
const jsonify = (value) => JSON.stringify(value);

const toISOString = (dateString) => dayjs(dateString).toISOString();

module.exports = {
  includes,
  limit,
  remove,
  sortByKey,
  where,
  wordCount,
  toHtml,
  escape,
  jsonify,
  toISOString,
};
