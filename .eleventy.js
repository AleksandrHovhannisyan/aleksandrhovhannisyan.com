const esbuild = require('esbuild');
const path = require('path');
const PluginFootnotes = require('eleventy-plugin-footnotes');
const {
  asideShortcode,
  imageShortcode,
  iconShortcode,
  socialIconShortcode,
  quoteShortcode,
  faviconShortcode,
  artworkShortcode,
  hashArtShortcode,
  nanoIdShortcode,
  detailsShortcode,
} = require('./config/shortcodes');
const {
  limit,
  sortByKey,
  toHtml,
  where,
  toISOString,
  formatDate,
  dividedBy,
  toAbsoluteUrl,
  getLatestCollectionItemDate,
  compileAndMinifyScss,
  toAbsoluteImageUrl,
  pathParse,
  pathJoin,
} = require('./config/filters/filters');
const {
  getAllPosts,
  getAllUniqueCategories,
  getPostsByCategory,
  getPopularCategories,
} = require('./config/collections');
const markdownLib = require('./config/plugins/markdown');
const { dir, imagePaths, scriptDirs } = require('./config/constants');
const { slugifyString } = require('./config/utils');
const { escape } = require('lodash');

const TEMPLATE_ENGINE = 'liquid';

module.exports = (eleventyConfig) => {
  eleventyConfig.setLiquidOptions({
    // Allows for dynamic include/partial names. If true, include names must be quoted. Defaults to true as of beta/1.0.
    dynamicPartials: false,
  });

  // Watch targets
  eleventyConfig.addWatchTarget(imagePaths.input);
  eleventyConfig.addWatchTarget(scriptDirs.input);

  // Pass-through copy for static assets
  eleventyConfig.addPassthroughCopy(`${dir.input}/${dir.assets}/fonts`);
  eleventyConfig.addPassthroughCopy(`${dir.input}/${dir.assets}/videos`);
  eleventyConfig.addPassthroughCopy(`${imagePaths.input}/404`);

  // Custom shortcodes
  eleventyConfig.addPairedShortcode('aside', asideShortcode);
  eleventyConfig.addPairedShortcode('quote', quoteShortcode);
  eleventyConfig.addPairedShortcode('artwork', artworkShortcode);
  eleventyConfig.addPairedShortcode('details', detailsShortcode);
  eleventyConfig.addShortcode('image', imageShortcode);
  eleventyConfig.addShortcode('favicon', faviconShortcode);
  eleventyConfig.addShortcode('icon', iconShortcode);
  eleventyConfig.addShortcode('socialIcon', socialIconShortcode);
  eleventyConfig.addShortcode('hashArt', hashArtShortcode);
  eleventyConfig.addShortcode('nanoid', nanoIdShortcode);

  // Custom filters
  eleventyConfig.addFilter('limit', limit);
  eleventyConfig.addFilter('sortByKey', sortByKey);
  eleventyConfig.addFilter('where', where);
  eleventyConfig.addFilter('escape', escape);
  eleventyConfig.addFilter('toHtml', toHtml);
  eleventyConfig.addFilter('toIsoString', toISOString);
  eleventyConfig.addFilter('formatDate', formatDate);
  eleventyConfig.addFilter('dividedBy', dividedBy);
  eleventyConfig.addFilter('toAbsoluteUrl', toAbsoluteUrl);
  eleventyConfig.addFilter('toAbsoluteImageUrl', toAbsoluteImageUrl);
  eleventyConfig.addFilter('slugify', slugifyString);
  eleventyConfig.addFilter('toJson', JSON.stringify);
  eleventyConfig.addFilter('fromJson', JSON.parse);
  eleventyConfig.addFilter('getLatestCollectionItemDate', getLatestCollectionItemDate);
  eleventyConfig.addFilter('compileAndMinifyScss', compileAndMinifyScss);
  eleventyConfig.addFilter('keys', Object.keys);
  eleventyConfig.addFilter('values', Object.values);
  eleventyConfig.addFilter('entries', Object.entries);
  eleventyConfig.addFilter('pathParse', pathParse);
  eleventyConfig.addFilter('pathJoin', pathJoin);

  // Custom collections
  eleventyConfig.addCollection('posts', getAllPosts);
  eleventyConfig.addCollection('categories', getAllUniqueCategories);
  eleventyConfig.addCollection('postsByCategory', getPostsByCategory);
  eleventyConfig.addCollection('popularCategories', getPopularCategories({ limit: 10, minCount: 5 }));

  // Plugins
  eleventyConfig.addPlugin(PluginFootnotes, {
    baseClass: 'footnotes',
    classes: {
      container: 'rhythm',
      list: 'list',
    },
    title: 'Footnotes',
    titleId: 'footnotes-label',
    backLinkLabel: (footnote, index) => `Back to reference ${index + 1}`,
  });
  eleventyConfig.setLibrary('md', markdownLib);

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
