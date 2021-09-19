const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');
const syntaxHighlightConfig = require('./config/plugins/syntaxHighlighter');
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
  unslugify,
  jsonParse,
  getLatestCollectionItemDate,
  compileAndMinifyScss,
} = require('./config/filters');
const { posts, categories, postsByCategory } = require('./config/collections');
const markdownLib = require('./config/plugins/markdown');
const { dir, imagePaths } = require('./config/constants');
const { slugifyString } = require('./config/utils');
const { escape } = require('lodash');

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
  eleventyConfig.addFilter('unslugify', unslugify);
  eleventyConfig.addFilter('jsonParse', jsonParse);
  eleventyConfig.addFilter('getLatestCollectionItemDate', getLatestCollectionItemDate);
  eleventyConfig.addFilter('compileAndMinifyScss', compileAndMinifyScss);
  eleventyConfig.addFilter('keys', Object.keys);
  eleventyConfig.addFilter('values', Object.values);
  eleventyConfig.addFilter('entries', Object.entries);

  // Custom collections
  eleventyConfig.addCollection('posts', posts);
  eleventyConfig.addCollection('categories', categories);
  eleventyConfig.addCollection('postsByCategory', postsByCategory);

  // Plugins
  eleventyConfig.addPlugin(syntaxHighlight, syntaxHighlightConfig);

  // Libraries
  eleventyConfig.setLibrary('md', markdownLib);

  return {
    dir,
    dataTemplateEngine: TEMPLATE_ENGINE,
    markdownTemplateEngine: TEMPLATE_ENGINE,
    htmlTemplateEngine: TEMPLATE_ENGINE,
    templateFormats: ['html', 'md', TEMPLATE_ENGINE],
  };
};
