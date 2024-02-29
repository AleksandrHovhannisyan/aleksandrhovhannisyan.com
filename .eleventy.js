import esbuild from 'esbuild';
import path from 'path';
import PluginFootnotes from 'eleventy-plugin-footnotes';
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
import escape from 'lodash-es/escape.js';

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
