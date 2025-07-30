import esbuild from 'esbuild';
import path from 'node:path';
import { markdown } from './plugins/markdown.js';
import site from '../src/_data/site.js';
import Image from '@11ty/eleventy-img';
import { get, memoize, withoutBaseDirectory } from './utils.js';

/** Returns the first `limit` elements of the the given array. */
export const limit = (array, limit) => {
  if (limit < 0) {
    throw new Error(`Negative limits are not allowed: ${limit}.`);
  }
  return array.slice(0, limit);
};

/** Sorts the given array of objects by a string denoting chained key paths.
 * @param {unknown[]} arrayOfObjects
 * @param {string} keyPath
 * @param {'ASC'|'DESC'} [order]
 */
export const sortByKey = (arrayOfObjects, keyPath, order = 'ASC') => {
  const sorted = arrayOfObjects.sort((obj1, obj2) => {
    const val1 = get(obj1, keyPath);
    const val2 = get(obj2, keyPath);
    const isString = typeof val1 === 'string' && typeof val2 === 'string';
    return isString ? val1.localeCompare(val2) : val1 - val2;
  });
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
export const toAbsoluteImageUrl = async ({ src, outputDir = 'dist/assets/images', width = null }) => {
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

/** Converts the given date string to ISO8601/RFC-3339 format.
 * @param {Date|string} date
 */
export const toISOString = (date) => new Date(date).toISOString();

function makeDateFormatter() {
  const mmmmDDYYYY = Intl.DateTimeFormat(site.lang, { month: 'long', day: '2-digit', year: 'numeric' });

  /**
   * @param {Date|string} dateLike
   * @param {'YYYY-MM-DD'|'MMMM DD, YYYY'} format
   */
  return function formatDate(dateLike, format) {
    const date = new Date(dateLike);
    switch (format) {
      case 'YYYY-MM-DD': {
        return toISOString(date).split('T')[0];
      }
      case 'MMMM DD, YYYY': {
        return mmmmDDYYYY.format(date);
      }
      default: {
        return date.toDateString();
      }
    }
  };
}
/** Formats a date as a string */
export const formatDate = makeDateFormatter();

/**
 * @param {*} collection - an array of collection items that are assumed to have either data.lastUpdated or a date property
 * @returns the most recent date of update or publication among the given collection items, or undefined if the array is empty.
 */
export const getLatestCollectionItemDate = (collection) => {
  const itemsSortedByLatestDate = collection
    .filter((item) => !!item.data?.lastUpdated || !!item.date)
    .sort((item1, item2) => {
      const date1 = new Date(item1.data?.lastUpdated ?? item1.date);
      const date2 = new Date(item2.data?.lastUpdated ?? item2.date);
      return date2 - date1;
    });
  const latestItem = itemsSortedByLatestDate[0];
  return latestItem?.data?.lastUpdated ?? latestItem?.date;
};

/** Minifies the given css string. */
export const cleanCSS = memoize(async (input) => {
  const { code } = await esbuild.transform(input, { loader: 'css', minify: true });
  return code;
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

/**
 * Converts all straight double and single quotes to smart (curly) quotes.
 * @param {string} text
 * @return {string}
 */
export const toSmartQuotes = (text) => {
  return (
    text
      // Smart opening and closing double quotes
      ?.replace(/"(.*?)"/g, '\u201C$1\u201D')
      // Smart apostrophes
      .replace(/(\w)'(\w)/g, '$1\u2019$2')
      // Smart opening and closing single quotes
      .replace(/'(.*?)'/g, '\u2018$1\u2019')
  );
};

/**
 * Given an input path for an asset (like CSS or JS), returns the output file path (with hash in production).
 * @param {string} inputPath A path relative to the root of this package, e.g. `src/assets/scripts/script.ts`.
 * @returns {string} A path relative to the root of the dist folder, e.g. `/assets/scripts/script.js`.
 */
export function getAssetOutputPath(inputPath) {
  if (inputPath.startsWith('http')) {
    return inputPath;
  }
  let outputPath = this.context.environments.assetPaths[inputPath];
  const assetsPathIndex = outputPath.indexOf('/assets/');
  return assetsPathIndex !== -1 ? outputPath.slice(assetsPathIndex) : outputPath;
}
