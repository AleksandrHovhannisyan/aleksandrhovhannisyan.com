import * as v from 'valibot';
import fs from 'node:fs';
import path from 'node:path';

const VALID_LAYOUT_FILE_NAMES = fs
  .readdirSync(path.resolve(import.meta.dirname, '../src/_layouts'))
  .map((file) => path.parse(file).name);

export const NON_EMPTY_STRING = v.pipe(v.string(), v.nonEmpty());

export const BASE_FRONT_MATTER_SCHEMA = v.object({
  // The page title, to be shown in <title> and possibly elsewhere
  title: NON_EMPTY_STRING,
  // The meta description for the page
  description: NON_EMPTY_STRING,
  // Eleventy URL path output for this page
  permalink: v.optional(v.union([NON_EMPTY_STRING, v.function()])),
  // Eleventy layout file
  layout: v.optional(v.picklist(VALID_LAYOUT_FILE_NAMES)),
  // Meta keywords (SEO)
  keywords: v.optional(v.array(NON_EMPTY_STRING)),
  // Eleventy tags or collections
  tags: v.optional(v.array(NON_EMPTY_STRING)),
  // For 301 redirects (see redirects.liquid)
  redirectFrom: v.optional(v.union([NON_EMPTY_STRING, v.array(NON_EMPTY_STRING)])),
  // For SEO (optional, defaults to current page URL)
  canonicalUrl: v.optional(NON_EMPTY_STRING),
  // OG images
  openGraph: v.optional(
    v.object({
      title: v.optional(NON_EMPTY_STRING),
      description: v.optional(NON_EMPTY_STRING),
      type: v.optional(v.picklist(['website', 'article'])),
      card: v.optional(v.picklist(['summary_large_image'])),
      image: v.optional(v.union([NON_EMPTY_STRING, v.function()])),
    })
  ),
  // Exclude this page from showing up in the collections global array
  eleventyExcludeFromCollections: v.optional(v.union([v.boolean(), v.function()])),
  // Whether to exclude the current page from the sitemap.xml file
  excludeFromSitemap: v.optional(v.boolean()),
  // Whether to discourage crawling this page
  noindex: v.optional(v.boolean()),
  // Theming
  isThemed: v.optional(v.boolean()),
  themeOverride: v.optional(v.picklist(['light', 'dark'])),
  // A list of CSS stylesheets to request in the <head>
  stylesheets: v.optional(v.array(NON_EMPTY_STRING)),
  // A list of JS files to request
  scripts: v.optional(
    v.union([
      v.array(
        v.object({
          src: NON_EMPTY_STRING,
          type: v.optional(v.picklist(['module', 'importmap'])),
          defer: v.optional(v.boolean()),
        })
      ),
      v.function(),
    ])
  ),
  // <link rel="preload"> tags in the <head>
  preloads: v.optional(
    v.array(
      v.object({
        href: NON_EMPTY_STRING,
        as: v.picklist(['fetch', 'font', 'image', 'script', 'style', 'track']),
        type: v.optional(NON_EMPTY_STRING),
        crossorigin: v.optional(v.boolean()),
      })
    )
  ),
  // Data computed from other data, https://www.11ty.dev/docs/data-computed/
  eleventyComputed: v.optional(v.lazy(() => v.partial(BASE_FRONT_MATTER_SCHEMA))),
});

/**
 * @param {v.ObjectSchema} schema
 */
export function makeSchemaValidator(schema) {
  /**
   * @param {unknown data}
   */
  return function (data) {
    const result = v.safeParse(schema, data);
    if (!result.success) {
      const issues = result.issues
        .map(({ issues, path }) => {
          return issues
            .map((issue, index) => {
              const { key } = path[index];
              return `${key}: expected ${issue.expected} but received ${issue.received}`;
            })
            .join(', ');
        })
        .join('\n');
      throw new Error(issues);
    }
  };
}
