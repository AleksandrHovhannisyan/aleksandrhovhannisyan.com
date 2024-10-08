import CleanCSS from 'clean-css';
import esbuild from 'esbuild';
import path from 'node:path';
import get from 'lodash/get.js';
import sortBy from 'lodash/sortBy.js';
import dayjs from 'dayjs';
import { markdown } from './plugins/markdown.js';
import site from '../src/_data/site.js';
import Image from '@11ty/eleventy-img';
import { memoize, withoutBaseDirectory } from './utils.js';
import { imagePaths } from './constants.js';

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
export const toHtml = (markdownString) => markdown.renderInline(markdownString);

/** Formats the given relative url as an absolute url.
 * @param {string} url
 * @param {string} [baseUrl]
 */
export const toAbsoluteUrl = (url, baseUrl = site.url) => new URL(url, baseUrl).href;

/** Given a local or remote image source, returns the absolute URL to the image that will eventually get generated once the site is built. */
export const toAbsoluteImageUrl = async ({ src, outputDir = imagePaths.output, width = null }) => {
  const imageOptions = {
    // For the purposes of getting an eventually-generated image's URL, we just want the original width and format
    widths: [width],
    formats: [null],
    // Where the generated image file should be saved by 11ty at build time
    outputDir,
    // Public URL path, for use in an img tag's src or in other markup (e.g., og:image path in meta tags)
    urlPath: withoutBaseDirectory(outputDir),
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

/** Minifies the given css string. */
export const cleanCSS = memoize((input) => {
  const { styles } = new CleanCSS({}).minify(input);
  return styles;
});

/** Minifies the given source JS (string). */
export const minifyJS = memoize(async (js) => {
  const { code } = await esbuild.transform(js, { minify: true });
  return code;
});

/**
 * Returns the file name or directory name of a path.
 * @param {string} srcPath The source path to parse.
 * @param {'name' | 'dir'} key A lookup key to get either the name or directory of the parsed path.
 * @returns
 */
export const pathParse = (srcPath, key) => path.parse(srcPath)[key];

export const pathJoin = (...paths) => path.join(...paths);
