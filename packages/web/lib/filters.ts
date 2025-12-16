import esbuild from 'esbuild';
import path from 'node:path';
import { markdown } from './plugins/markdown.ts';
import site from '../src/_data/site.ts';
import Image from '@11ty/eleventy-img';
import { get, memoize, withoutBaseDirectory } from './utils/index.ts';
import type { FrontMatter } from './schema.ts';

/** Returns the first `limit` elements of the the given array. */
export const limit = (array: unknown[], limit: number) => {
  if (limit < 0) {
    throw new Error(`Negative limits are not allowed: ${limit}.`);
  }
  return array.slice(0, limit);
};

/** Sorts the given array of objects by a string denoting chained key paths. */
export const sortByKey = (
  arrayOfObjects: Record<string, unknown>[],
  keyPath: string,
  order: 'ASC' | 'DESC' = 'ASC'
) => {
  const sorted = arrayOfObjects.sort((obj1, obj2) => {
    const val1 = get(obj1, keyPath);
    const val2 = get(obj2, keyPath);
    if (typeof val1 === 'string' && typeof val2 === 'string') {
      return val1.localeCompare(val2);
    }
    if (typeof val1 === 'number' && typeof val2 === 'number') {
      return val1 - val2;
    }
    throw new Error(`Unexpected error while sorting by "${keyPath}": ${typeof val1}, ${typeof val2}`);
  });
  if (order === 'ASC') return sorted;
  if (order === 'DESC') return sorted.reverse();
  throw new Error(`Invalid sort order: ${order}`);
};

/** Returns all entries from the given array that match the specified key:value pair. */
export const where = (arrayOfObjects: Record<string, unknown>[], keyPath: string, value: unknown) =>
  arrayOfObjects.filter((object) => get(object, keyPath) === value);

/** Converts the given markdown string to HTML, returning it as a string. */
export const toHtml = (markdownString: string) => markdown.renderInline(markdownString);

/** Formats the given relative url as an absolute url. */
export const toAbsoluteUrl = (url: string, baseUrl: string = site.url) => new URL(url, baseUrl).href;

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

/** Converts the given date string to ISO8601/RFC-3339 format. */
export const toISOString = (date: Date | string) => new Date(date).toISOString();

function makeDateFormatter() {
  const mmmmDDYYYY = Intl.DateTimeFormat(site.lang, { month: 'long', day: '2-digit', year: 'numeric' });

  return function formatDate(dateLike: Date | string, format: 'YYYY-MM-DD' | 'MMMM DD, YYYY') {
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
 * @param collection an array of collection items that are assumed to have either data.lastUpdated or a date property
 * @returns the most recent date of update or publication among the given collection items, or undefined if the array is empty.
 */
export const getLatestCollectionItemDate = (collection: Partial<FrontMatter & { data: Partial<FrontMatter> }>[]) => {
  const itemsSortedByLatestDate = collection
    .filter((item) => !!item.data?.lastUpdated || !!item.date)
    .sort((item1, item2) => {
      const date1 = +new Date(item1.data?.lastUpdated ?? item1.date);
      const date2 = +new Date(item2.data?.lastUpdated ?? item2.date);
      return date2 - date1;
    });
  const latestItem = itemsSortedByLatestDate[0];
  return latestItem?.data?.lastUpdated ?? latestItem?.date;
};

/** Minifies the given css string. */
export const minifyCSS = memoize(async (input: string) => {
  const { code } = await esbuild.transform(input, { loader: 'css', minify: true });
  return code;
});

/** Minifies the given source JS (string). */
export const minifyJS = memoize(async (js: string) => {
  const { code } = await esbuild.transform(js, { minify: true });
  return code;
});

/**
 * Returns the file name or directory name of a path.
 * @param srcPath The source path to parse.
 * @param key A lookup key to get either the name or directory of the parsed path.
 */
export const pathParse = (srcPath: string, key: 'name' | 'dir') => path.parse(srcPath)[key];

export const pathJoin = (...paths: string[]) => path.join(...paths);

/**
 * Converts all straight double and single quotes to smart (curly) quotes.
 */
export const toSmartQuotes = (text: string): string => {
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
 * @param inputPath A path relative to the root of this package, e.g. `src/assets/scripts/script.ts`.
 * @returns A path relative to the root of the dist folder, e.g. `/assets/scripts/script.js`.
 */
export function getAssetOutputPath(inputPath: string): string {
  if (inputPath.startsWith('http')) {
    return inputPath;
  }
  return withoutBaseDirectory(this.context.environments.sourceMap[inputPath]);
}
