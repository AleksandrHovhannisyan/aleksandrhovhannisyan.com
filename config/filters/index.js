const path = require('path');
const lodash = require('lodash');
const sass = require('sass');
const dayjs = require('dayjs');
const markdownLib = require('../plugins/markdown');
const site = require('../../src/_data/site');
const Image = require('@11ty/eleventy-img');
const { throwIfNotType } = require('../utils');
const { dir, imagePaths } = require('../constants');

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

/** Formats the given string as an absolute url. */
const toAbsoluteUrl = (url) => {
  throwIfNotType(url, 'string');
  // Replace trailing slash, e.g., site.com/ => site.com
  const siteUrl = site.url.replace(/\/$/, '');
  // Replace starting slash, e.g., /path/ => path/
  const relativeUrl = url.replace(/^\//, '');

  return `${siteUrl}/${relativeUrl}`;
};

/** Given a local or remote image source, returns the absolute URL to the image that will eventually get generated once the site is built. */
const toAbsoluteImageUrl = async (src, width = null) => {
  const imageOptions = {
    // For the purposes of getting the URL, we just want the original width and format
    widths: [width],
    formats: [null],
    // Where the generated image files get saved
    outputDir: imagePaths.output,
    // Public URL path that's referenced in the img tag's src attribute
    urlPath: imagePaths.output.replace(dir.output, ''),
  };
  const stats = await Image(src, imageOptions);
  return toAbsoluteUrl(Object.values(stats)[0][0].url);
};

/** Converts the given date string to ISO8610 format. */
const toISOString = (dateString) => dayjs(dateString).toISOString();

/** Formats a date using dayjs's conventions: https://day.js.org/docs/en/display/format */
const formatDate = (date, format) => dayjs(date).format(format);

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

/** Given a scss string, compile it to CSS, minify the result, and return the final CSS as a string. */
const compileAndMinifyScss = (scss) => {
  return sass.renderSync({ data: scss, outputStyle: 'compressed' }).css.toString();
};

/**
 * Returns the file name or directory name of a path.
 * @param {string} srcPath The source path to parse.
 * @param {'name' | 'dir'} key A lookup key to get either the name or directory of the parsed path.
 * @returns
 */
const pathParse = (srcPath, key) => path.parse(srcPath)[key];

const pathJoin = (...paths) => path.join(...paths);

module.exports = {
  limit,
  sortByKey,
  where,
  toHtml,
  toISOString,
  formatDate,
  dividedBy,
  toAbsoluteUrl,
  toAbsoluteImageUrl,
  getLatestCollectionItemDate,
  compileAndMinifyScss,
  pathParse,
  pathJoin,
};
