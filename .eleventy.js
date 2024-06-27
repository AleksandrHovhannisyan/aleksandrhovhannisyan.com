import esbuild from 'esbuild';
import path from 'path';
import PluginFootnotes from 'eleventy-plugin-footnotes';
import EleventyPluginNetlifyRedirects from 'eleventy-plugin-netlify-redirects';
import { EleventyPluginCodeDemo } from 'eleventy-plugin-code-demo';
import {
  asideShortcode,
  definitionShortcode,
  imageShortcode,
  iconShortcode,
  socialIconShortcode,
  quoteShortcode,
  faviconShortcode,
  artworkShortcode,
  hashArtShortcode,
  nanoIdShortcode,
  detailsShortcode,
  fetchText,
} from './config/shortcodes/index.js';
import {
  limit,
  sortByKey,
  toHtml,
  where,
  toISOString,
  formatDate,
  dividedBy,
  toAbsoluteUrl,
  getLatestCollectionItemDate,
  makeCleanCSS,
  minifyJS,
  toAbsoluteImageUrl,
  pathParse,
  pathJoin,
} from './config/filters/filters.js';
import {
  getAllPosts,
  getAllUniqueCategories,
  getPostsByCategory,
} from './config/collections/collections.js';
import { markdown } from './config/plugins/markdown.js';
import { codeDemoOptions } from './config/plugins/codeDemo.js';
import { dir, imagePaths, scriptDirs } from './config/constants.js';
import { slugifyString } from './config/utils.js';
import escape from 'lodash/escape.js';

const TEMPLATE_ENGINE = 'liquid';

export default function eleventy(eleventyConfig) {
  eleventyConfig.setLiquidOptions({
    // Allows for dynamic include/partial names. If true, include names must be quoted. Defaults to true as of beta/1.0.
    dynamicPartials: true,
  });

  // Watch targets
  eleventyConfig.addWatchTarget(imagePaths.input);
  eleventyConfig.addWatchTarget(scriptDirs.input);

  // Pass-through copy for static assets
  eleventyConfig.setServerPassthroughCopyBehavior("passthrough");
  eleventyConfig.addPassthroughCopy(path.join(dir.input, dir.assets, 'fonts'));
  eleventyConfig.addPassthroughCopy(path.join(dir.input, dir.assets, 'videos'));
  eleventyConfig.addPassthroughCopy(path.join(imagePaths.input, 'art'));

  // Custom shortcodes
  eleventyConfig.addPairedShortcode('aside', asideShortcode);
  eleventyConfig.addPairedShortcode('quote', quoteShortcode);
  eleventyConfig.addPairedShortcode('definition', definitionShortcode);
  eleventyConfig.addPairedShortcode('artwork', artworkShortcode);
  eleventyConfig.addPairedShortcode('details', detailsShortcode);
  eleventyConfig.addShortcode('image', imageShortcode);
  eleventyConfig.addShortcode('favicon', faviconShortcode);
  eleventyConfig.addShortcode('icon', iconShortcode);
  eleventyConfig.addShortcode('socialIcon', socialIconShortcode);
  eleventyConfig.addShortcode('hashArt', hashArtShortcode);
  eleventyConfig.addShortcode('nanoid', nanoIdShortcode);
  eleventyConfig.addShortcode('fetchText', fetchText);

  // Custom filters
  eleventyConfig.addFilter('limit', limit);
  eleventyConfig.addFilter('sortByKey', sortByKey);
  eleventyConfig.addFilter('where', where);
  eleventyConfig.addFilter('escape', escape);
  eleventyConfig.addFilter('toHtml', toHtml);
  eleventyConfig.addFilter('toISOString', toISOString);
  eleventyConfig.addFilter('formatDate', formatDate);
  eleventyConfig.addFilter('dividedBy', dividedBy);
  eleventyConfig.addFilter('toAbsoluteUrl', toAbsoluteUrl);
  eleventyConfig.addFilter('toAbsoluteImageUrl', toAbsoluteImageUrl);
  eleventyConfig.addFilter('slugify', slugifyString);
  eleventyConfig.addFilter('toJson', JSON.stringify);
  eleventyConfig.addFilter('fromJson', JSON.parse);
  eleventyConfig.addFilter('getLatestCollectionItemDate', getLatestCollectionItemDate);
  eleventyConfig.addFilter('cleanCSS', makeCleanCSS());
  eleventyConfig.addFilter('minifyJS', minifyJS);
  eleventyConfig.addFilter('keys', Object.keys);
  eleventyConfig.addFilter('values', Object.values);
  eleventyConfig.addFilter('entries', Object.entries);
  eleventyConfig.addFilter('pathParse', pathParse);
  eleventyConfig.addFilter('pathJoin', pathJoin);

  // Custom collections
  eleventyConfig.addCollection('posts', getAllPosts);
  eleventyConfig.addCollection('categories', getAllUniqueCategories);
  eleventyConfig.addCollection('postsByCategory', getPostsByCategory);

  // Plugins
  /** @type {import("eleventy-plugin-netlify-redirects").EleventyPluginNetlifyRedirectsOptions} */
  const eleventyPluginNetlifyRedirectsOptions = {
    staticRedirects: {
      // Old blog structure with primary categories in URL. Some links still floating around on other sites.
      "/blog/dev/*": "/blog/:splat",
      "/blog/computer-science/*": "/blog/:splat",
      "/blog/off-topic/*": "/blog/:splat",
      // Old image structure, where blog post images were dumped into a folder of the same name as the post slug itself.
      "/assets/images/posts/:slug/*": "/assets/images/:splat",
      // FSM article images, already indexed. Redirect to avoid impacting traffic to this post. https://www.aleksandrhovhannisyan.com/blog/implementing-a-finite-state-machine-in-cpp/
      "/assets/images/iomJzXpBY2-1280.png": "/assets/images/iAape8KQe6-1200.png",
      "/assets/images/YVvOoXOAhY-1094.jpeg": "/assets/images/iAape8KQe6-1200.jpeg",
      "/assets/images/YVvOoXOAhY-1094.webp": "/assets/images/iAape8KQe6-1200.webp",
      "/assets/images/9LW1h6jx7k-1063.jpeg": "/assets/images/Z0MJRY8WpN-1271.jpeg",
      "/assets/images/9LW1h6jx7k-1063.webp": "/assets/images/Z0MJRY8WpN-1271.webp",
    },
    frontMatterOverrides: { excludeFromSitemap: true },
  };
  eleventyConfig.addPlugin(EleventyPluginNetlifyRedirects, eleventyPluginNetlifyRedirectsOptions);
  eleventyConfig.addPlugin(PluginFootnotes, {
    baseClass: 'footnotes',
    classes: {
      container: 'rhythm',
    },
    title: 'Footnotes',
    titleId: 'footnotes-label',
    backLinkLabel: (footnote, index) => `Back to reference ${index + 1}`,
  });
  eleventyConfig.addPlugin(EleventyPluginCodeDemo, codeDemoOptions);
  eleventyConfig.setLibrary('md', markdown);

  // Post-processing
  eleventyConfig.on('afterBuild', () => {
    return esbuild.build({
      entryPoints: [
        path.join(scriptDirs.input, 'index.mjs'),
        path.join(scriptDirs.input, 'demos/Carousel/index.mjs'),
        path.join(scriptDirs.input, 'comments.mjs'),
      ],
      entryNames: '[dir]/[name]',
      outdir: scriptDirs.output,
      format: 'esm',
      outExtension: { '.js': '.mjs' },
      bundle: true,
      splitting: true,
      minify: true,
      sourcemap: process.env.ELEVENTY_ENV !== 'production',
      loader: {
        '.svg': 'text',
      },
    });
  });

  return {
    dir,
    dataTemplateEngine: TEMPLATE_ENGINE,
    markdownTemplateEngine: TEMPLATE_ENGINE,
    htmlTemplateEngine: TEMPLATE_ENGINE,
    templateFormats: ['html', 'md', TEMPLATE_ENGINE],
  };
};
