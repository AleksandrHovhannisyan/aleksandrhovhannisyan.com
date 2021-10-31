const PluginSyntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');
const PluginFootnotes = require('eleventy-plugin-footnotes')
const { asideShortcode, imageShortcode, iconShortcode, socialIconShortcode, quoteShortcode } = require('./config/shortcodes');
const {
  wordCount,
  limit,
  sortByKey,
  toHtml,
  where,
  toISOString,
  dividedBy,
  newlineToBr,
  toAbsoluteUrl,
  stripNewlines,
  stripHtml,
  jsonParse,
  getLatestCollectionItemDate,
  compileAndMinifyScss,
} = require('./config/filters');
const { getAllPosts, getAllUniqueCategories, getPostsByCategory } = require('./config/collections');
const markdownLib = require('./config/plugins/markdown');
const { dir, imagePaths } = require('./config/constants');
const { slugifyString } = require('./config/utils');
const { escape } = require('lodash');
const dotenv = require('dotenv');

// Load .env environment variables
dotenv.config()

const TEMPLATE_ENGINE = 'liquid';

module.exports = (eleventyConfig) => {
  // Watch targets
  eleventyConfig.addWatchTarget(imagePaths.source);

  // Pass-through copy for static assets
  eleventyConfig.addPassthroughCopy(`${dir.input}/${dir.assets}/fonts`);
  eleventyConfig.addPassthroughCopy(`${imagePaths.source}/art`);
  eleventyConfig.addPassthroughCopy(`${imagePaths.source}/404`);

  // Custom shortcodes
  eleventyConfig.addPairedShortcode('aside', asideShortcode);
  eleventyConfig.addPairedShortcode('quote', quoteShortcode);
  eleventyConfig.addShortcode('image', imageShortcode);
  eleventyConfig.addShortcode('icon', iconShortcode);
  eleventyConfig.addShortcode('socialIcon', socialIconShortcode);

  // Custom filters
  eleventyConfig.addFilter('wordCount', wordCount);
  eleventyConfig.addFilter('limit', limit);
  eleventyConfig.addFilter('sortByKey', sortByKey);
  eleventyConfig.addFilter('where', where);
  eleventyConfig.addFilter('escape', escape);
  eleventyConfig.addFilter('jsonify', JSON.stringify);
  eleventyConfig.addFilter('toHtml', toHtml);
  eleventyConfig.addFilter('toIsoString', toISOString);
  eleventyConfig.addFilter('dividedBy', dividedBy);
  eleventyConfig.addFilter('newlineToBr', newlineToBr);
  eleventyConfig.addFilter('toAbsoluteUrl', toAbsoluteUrl);
  eleventyConfig.addFilter('stripNewlines', stripNewlines);
  eleventyConfig.addFilter('stripHtml', stripHtml);
  eleventyConfig.addFilter('slugify', slugifyString);
  eleventyConfig.addFilter('jsonParse', jsonParse);
  eleventyConfig.addFilter('getLatestCollectionItemDate', getLatestCollectionItemDate);
  eleventyConfig.addFilter('compileAndMinifyScss', compileAndMinifyScss);
  eleventyConfig.addFilter('keys', Object.keys);
  eleventyConfig.addFilter('values', Object.values);
  eleventyConfig.addFilter('entries', Object.entries);

  // Custom collections
  eleventyConfig.addCollection('posts', getAllPosts);
  eleventyConfig.addCollection('categories', getAllUniqueCategories);
  eleventyConfig.addCollection('postsByCategory', getPostsByCategory);

  // Plugins
  eleventyConfig.addPlugin(PluginSyntaxHighlight, {
    // Change which Eleventy template formats use syntax highlighters
    templateFormats: ['md'], // default
    // Added in 3.0, set to true to always wrap lines in `<span class="highlight-line">`
    // The default (false) only wraps when line numbers are passed in.
    alwaysWrapLineHighlights: false,
    // Added in 3.0.2, set to false to opt-out of pre-highlight removal of leading
    // and trailing whitespace
    trim: true,
    // Added in 3.0.4, change the separator between lines (you may want "\n")
    lineSeparator: '\n',
    // Added in 3.1.1, add HTML attributes to the <pre> or <code> tags
    preAttributes: {},
    codeAttributes: {},
  });
  eleventyConfig.addPlugin(PluginFootnotes, {
    baseClass: 'footnotes',
    classes: {
      list: 'list',
    },
    title: 'Footnotes',
    titleId: 'footnotes-label',
    backLinkLabel: (footnote, index) => `Back to reference ${index + 1}`,
  });
  eleventyConfig.setLibrary('md', markdownLib);

  return {
    dir,
    dataTemplateEngine: TEMPLATE_ENGINE,
    markdownTemplateEngine: TEMPLATE_ENGINE,
    htmlTemplateEngine: TEMPLATE_ENGINE,
    templateFormats: ['html', 'md', TEMPLATE_ENGINE],
  };
};
