import * as v from 'valibot';
import fs from 'node:fs';
import path from 'node:path';

const VALID_LAYOUT_FILE_NAMES = fs
  .readdirSync(path.resolve(import.meta.dirname, '../src/_layouts'))
  .map((file) => path.parse(file).name);

export const NON_EMPTY_STRING = v.pipe(v.string(), v.nonEmpty());
export const NON_EMPTY_ARRAY = (type) => v.pipe(v.array(type), v.minLength(1));
export const ISO_DATE_STRING = v.pipe(v.string(), v.isoDate());

const FRONT_MATTER_BASE = v.object({
  /**
   * The page title, to be shown in <title> and possibly elsewhere
   */
  title: NON_EMPTY_STRING,
  /**
   * The meta description for the page
   */
  description: NON_EMPTY_STRING,
  /**
   * Eleventy URL path output for this page
   */
  permalink: v.optional(v.union([NON_EMPTY_STRING, v.function()])),
  /**
   * Publication date. May either be a string or date as YAML supports both and coerces as needed.
   */
  date: v.optional(v.union([ISO_DATE_STRING, v.date()])),
  /**
   * Date when this item was last updated/edited
   */
  lastUpdated: v.optional(v.union([ISO_DATE_STRING, v.date()])),
  /**
   * Eleventy layout file
   */
  layout: v.optional(v.picklist(VALID_LAYOUT_FILE_NAMES)),
  /**
   * Meta keywords (SEO)
   */
  keywords: v.optional(NON_EMPTY_ARRAY(NON_EMPTY_STRING)),
  /**
   * Eleventy tags or collections
   */
  tags: v.optional(NON_EMPTY_ARRAY(NON_EMPTY_STRING)),
  /**
   * For 301 redirects (see redirects.liquid)
   */
  redirectFrom: v.optional(v.union([NON_EMPTY_STRING, NON_EMPTY_ARRAY(NON_EMPTY_STRING)])),
  /**
   * For SEO (optional, defaults to current page URL)
   */
  canonicalUrl: v.optional(NON_EMPTY_STRING),
  /**
   * OpenGraph data for social sharing
   */
  openGraph: v.optional(
    v.union([
      v.object({
        /**
         * The Open Graph title
         */
        title: v.optional(NON_EMPTY_STRING),
        /**
         * The Open Graph description
         */
        description: v.optional(NON_EMPTY_STRING),
        /**
         * The Open Graph item type (e.g., website or article)
         */
        type: v.optional(v.picklist(['website', 'article'])),
        /**
         * The Open Graph card type (e.g., summary_large_image)
         */
        card: v.optional(v.picklist(['summary_large_image'])),
        /**
         * The Open Graph image URL. Must be an absolute URL to work on external social media sites.
         */
        image: v.optional(NON_EMPTY_STRING),
      }),
      v.function(),
    ])
  ),
  /**
   * Exclude this page from showing up in the collections global array
   */
  eleventyExcludeFromCollections: v.optional(v.boolean()),
  /**
   * Whether to exclude the current page from the sitemap.xml file
   */
  excludeFromSitemap: v.optional(v.boolean()),
  /**
   * Whether to discourage crawling this page
   */
  noindex: v.optional(v.boolean()),
  /**
   * Whether the page is themed
   */
  isThemed: v.optional(v.boolean()),
  /**
   * Override the theme for this page (light or dark)
   */
  themeOverride: v.optional(v.picklist(['light', 'dark'])),
  /**
   * A list of CSS stylesheets to request in the <head>
   */
  stylesheets: v.optional(NON_EMPTY_ARRAY(NON_EMPTY_STRING)),
  /**
   * A list of JS files to request
   */
  scripts: v.optional(
    NON_EMPTY_ARRAY(
      v.object({
        /**
         * The source URL of the script
         */
        src: NON_EMPTY_STRING,
        /**
         * The type of the script (e.g., module or importmap)
         */
        type: v.optional(v.picklist(['module', 'importmap'])),
        /**
         * Whether to defer the script
         */
        defer: v.optional(v.boolean()),
      })
    )
  ),
  /**
   * <link rel="preload"> tags in the <head>
   */
  preloads: v.optional(
    NON_EMPTY_ARRAY(
      v.object({
        /**
         * The href of the preload link
         */
        href: NON_EMPTY_STRING,
        /**
         * The resource type (e.g., fetch, font, image, etc.)
         */
        as: v.picklist(['fetch', 'font', 'image', 'script', 'style', 'track']),
        /**
         * The MIME type of the resource
         */
        type: v.optional(NON_EMPTY_STRING),
        /**
         * Whether to include the crossorigin attribute. Should be `true` if `as` is `"font"` or `"fetch"`.
         */
        crossorigin: v.optional(v.boolean()),
      })
    )
  ),
  /**
   * Eleventy schema validator
   */
  eleventyDataSchema: v.optional(v.function()),
});

export const FrontMatter = v.object({
  ...FRONT_MATTER_BASE.entries,
  /** Recursive data computed from other data, https://www.11ty.dev/docs/data-computed/ */
  eleventyComputed: v.optional(
    v.lazy(() =>
      v.partial(
        v.object(
          Object.fromEntries(
            // Every key can optionally be a function that takes the schema front matter as an argument and returns a value of the same type
            Object.entries(FRONT_MATTER_BASE.entries).map(([key, value]) => [
              key,
              v.union([value, v.pipe(v.function(), v.returns(value))]),
            ])
          )
        )
      )
    )
  ),
});

/**
 * @param {v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>} schema
 */
export function makeSchemaValidator(schema) {
  return function (data) {
    v.parse(schema, data);
  };
}

/**
 * @typedef {v.InferInput<typeof FrontMatter>} FrontMatter
 */

/**
 * @typedef {Object} EleventyPageData
 * @property {Object} [page] - Data specific to the current page.
 * @property {string} page.inputPath - The input path of the page.
 * @property {string} page.fileSlug - The file slug of the page.
 * @property {string} [page.url] - The URL of the page.
 * @property {Object} eleventy - Eleventy globals.
 * @property {Object} eleventy.directories - Eleventy directories.
 * @property {string} eleventy.directories.output - The output directory.
 * @property {string} eleventy.directories.input - The input directory.
 */
