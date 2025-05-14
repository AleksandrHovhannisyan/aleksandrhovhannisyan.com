import * as v from 'valibot';
import path from 'node:path';
import { toAbsoluteImageUrl } from '../../lib/filters.js';
import { FrontMatter, makeSchemaValidator, NON_EMPTY_ARRAY, NON_EMPTY_STRING } from '../../lib/schema.js';

const isProduction = process.env.ELEVENTY_ENV === 'production';

const BlogPostFrontMatter = v.object({
  ...FrontMatter.entries,
  /**
   * Categories for this post. Used in the post metadata and in the RSS feed.
   * Not to be confused with Eleventy tags.
   */
  categories: NON_EMPTY_ARRAY(NON_EMPTY_STRING),
  /**
   * The URL of the thumbnail image for this post. This is used in the post metadata and in the RSS feed.
   * Must be an absolute URL if specified.
   */
  thumbnail: v.optional(NON_EMPTY_STRING),
  /**
   * The date this post was last updated. This is used in the post metadata and in the RSS feed.
   */
  lastUpdated: v.optional(v.date()),
  /**
   * The ID of the comments section for this post. This is just the GitHub issue number.
   * https://www.aleksandrhovhannisyan.com/blog/static-site-comments-github-issues/
   */
  commentsId: v.optional(v.number()),
  /**
   * Whether this post is featured on the blog index.
   */
  isFeatured: v.optional(v.boolean()),
  /**
   * Whether this is a draft post. Drafts are only visible in development.
   */
  isDraft: v.optional(v.boolean()),
  /**
   * Whether this is an archived post. Archived posts are hidden from the blog index, RSS feed, sitemap, etc.
   */
  isArchived: v.optional(v.boolean()),
});

/**
 * @typedef {v.InferInput<typeof BlogPostFrontMatter>} BlogPostFrontMatter
 */

/**l
 * @typedef {BlogPostFrontMatter & import('../../lib/schema.js').EleventyPageData} BlogPageData
 */

/**
 * @type {Partial<BlogPostFrontMatter>}
 */
const data = {
  eleventyDataSchema: makeSchemaValidator(BlogPostFrontMatter),
  layout: 'post',
  /**
   * @param {BlogPageData} data
   */
  permalink: (data) => {
    // Ignore/hide drafts on prod
    if (data?.isDraft && isProduction) {
      return false;
    }
    if (data?.categories?.includes('note')) {
      return `/notes/${data?.page?.fileSlug}/`;
    }
    return `/blog/${data?.page?.fileSlug}/`;
  },
  eleventyComputed: {
    // Ignore/hide drafts on prod
    eleventyExcludeFromCollections: (data) => !!data.isDraft && isProduction,
    /**
     * @param {BlogPageData} data
     */
    scripts: (data) => {
      const scripts = [
        ...data.scripts,
        {
          type: 'module',
          src: '/assets/scripts/copyCode.js',
        },
      ];
      // If the post has comments and comments are enabled, link to the comment script to load them
      if (data.commentsId) {
        scripts.push({ type: 'module', src: `/assets/scripts/comments.js` });
      }
      return scripts;
    },
    /**
     * @param {BlogPageData} data
     */
    openGraph: async (data) => {
      const getImage = () => {
        // TODO: add a fallback social preview image
        if (!data.thumbnail || !data.page?.url) {
          return;
        }
        let src;
        // Remote image, no need to manipulate src as it's already an absolute path.
        if (data.thumbnail.match(/^https?:\/\//)) {
          src = data.thumbnail;
        } else {
          // Local blog post image with relative path (e.g., `./images/thumbnail.png`). Convert src to absolute path so the 11ty image plugin can find it.
          const { dir: blogPostSourceDirectory } = path.parse(data.page.inputPath);
          src = path.join(blogPostSourceDirectory, data.thumbnail);
        }
        // Save in same output directory as the post itself.
        const outputDir = path.join(data.eleventy.directories.output, data.page.url);
        // OG images must be absolute URLs.
        return toAbsoluteImageUrl({ src, outputDir });
      };
      return {
        type: 'article',
        // For social sharing. Used in og:image and twitter:image. Absolute path to the post's thumbnail image.
        // Thumbnails may be remote images (thumbnail.url) or local images (thumbnail as a string path, like ./images/thumbnail.png).
        image: await getImage(),
      };
    },
  },
};

export default data;
