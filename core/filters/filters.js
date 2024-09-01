import CleanCSS from 'clean-css';
import esbuild from 'esbuild';
import path from 'node:path';
import get from 'lodash/get.js';
import sortBy from 'lodash/sortBy.js';
import dayjs from 'dayjs';
import { markdown } from '../plugins/markdown.js';
import site from '../../src/_data/site.js';
import Image from '@11ty/eleventy-img';
import { throwIfNotType, withoutBaseDirectory } from '../utils.js';
import { imagePaths } from '../constants.js';

/** Returns the first `limit` elements of the the given array. */
export const limit = (array, limit) => {
  if (limit < 0) {
    throw new Error(`Negative limits are not allowed: ${limit}.`);
  }
  return array.slice(0, limit);
};

/** Sorts the given array of objects by a string denoting chained key paths. */
export const sortByKey = (arrayOfObjects, keyPath, order = 'ASC') => {
  const sorted = sortBy(arrayOfObjects, (object) => get(object, keyPath));
  if (order === 'ASC') return sorted;
  if (order === 'DESC') return sorted.reverse();
  throw new Error(`Invalid sort order: ${order}`);
};

/** Returns all entries from the given array that match the specified key:value pair. */
export const where = (arrayOfObjects, keyPath, value) =>
  arrayOfObjects.filter((object) => get(object, keyPath) === value);

/** Converts the given markdown string to HTML, returning it as a string. */
export const toHtml = (markdownString) => {
  return markdown.renderInline(markdownString);
};

/** Divides the first argument by the second. */
export const dividedBy = (numerator, denominator) => {
  if (denominator === 0) {
    throw new Error(`Cannot divide by zero: ${numerator} / ${denominator}`);
  }
  return numerator / denominator;
};

/** Formats the given relative url as an absolute url. */
export const toAbsoluteUrl = (url) => {
  throwIfNotType(url, 'string');
  return new URL(url, site.url).href;
};

/** Given a local or remote image source, returns the absolute URL to the image that will eventually get generated once the site is built. */
export const toAbsoluteImageUrl = async (src, width = null) => {
  const imageOptions = {
    // For the purposes of getting the URL, we just want the original width and format
    widths: [width],
    formats: [null],
    // Where the generated image files get saved
    outputDir: imagePaths.output,
    // Public URL path that's referenced in the img tag's src attribute
    urlPath: withoutBaseDirectory(imagePaths.output),
  };
  const stats = await Image(src, imageOptions);
  return toAbsoluteUrl(Object.values(stats)[0][0].url);
};

/** Converts the given date string to ISO8601/RFC-3339 format. */
export const toISOString = (dateString) => dayjs(dateString).toISOString();

/** Formats a date using dayjs's conventions: https://day.js.org/docs/en/display/format */
export const formatDate = (date, format) => dayjs(date).format(format);

/**
 * @param {*} collection - an array of collection items that are assumed to have either data.lastUpdated or a date property
 * @returns the most recent date of update or publication among the given collection items, or undefined if the array is empty.
 */
export const getLatestCollectionItemDate = (collection) => {
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

/** Returns an optimized CSS minifier function. */
export const makeCleanCSS = () => {
  // Currently, the cleanCSS filter is being called on essentially the same CSS for every single page
  // with the same exact input. Caching yields about a ~6x performance increase.
  const cache = {};
  const cleaner = new CleanCSS({});

  /** Given a css string, returns the minified css. */
  return (input) => {
    let key = JSON.stringify(input);
    if (!cache[key]) {
      const { styles } = cleaner.minify(input);
      cache[key] = styles;
    }
    return cache[key];
  };
};

/** Minifies the given source JS (string).
 * @param {string} js The JavaScript to minify, provided as a string.
 */
export const minifyJS = async (js) => {
  const { code } = await esbuild.transform(js, { minify: true });
  return code;
};

/**
 * Returns the file name or directory name of a path.
 * @param {string} srcPath The source path to parse.
 * @param {'name' | 'dir'} key A lookup key to get either the name or directory of the parsed path.
 * @returns
 */
export const pathParse = (srcPath, key) => path.parse(srcPath)[key];

export const pathJoin = (...paths) => path.join(...paths);
