const pluginRss = require('@11ty/eleventy-plugin-rss');
const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');
const syntaxHighlightConfig = require('./config/plugins/syntaxHighlighter');
const imageShortcode = require('./config/shortcodes/image');
const iconShortcode = require('./config/shortcodes/icon');
const socialIconShortcode = require('./config/shortcodes/socialIcon');
const {
  wordCount,
  limit,
  sortByKey,
  toHtml,
  jsonify,
  where,
  toISOString,
  dividedBy,
  newlineToBr,
  toAbsoluteUrl,
  stripNewlines,
  stripHtml,
  unslugify,
} = require('./config/filters');
const { posts, categories, postsByCategory } = require('./config/collections');
const markdownLib = require('./config/plugins/markdown');
const { dir, imagePaths } = require('./config/constants');
const { slugifyString } = require('./config/utils');
const { escape } = require('lodash');

module.exports = (eleventyConfig) => {
  // Watch targets
  eleventyConfig.addWatchTarget(imagePaths.source);

  // Pass-through copy for static assets
  eleventyConfig.addPassthroughCopy(`${dir.input}/${dir.assets}/fonts`);
  eleventyConfig.addPassthroughCopy(`${imagePaths.source}/art`);
  eleventyConfig.addPassthroughCopy(`${imagePaths.source}/404`);

  // Register custom shortcodes
  eleventyConfig.addLiquidShortcode('image', imageShortcode);
  eleventyConfig.addLiquidShortcode('icon', iconShortcode);
  eleventyConfig.addLiquidShortcode('socialIcon', socialIconShortcode);

  // Register custom filters. Some common Liquid filters are redefined for consistent casing (camelCase).
  eleventyConfig.addLiquidFilter('wordCount', wordCount);
  eleventyConfig.addLiquidFilter('limit', limit);
  eleventyConfig.addLiquidFilter('sortByKey', sortByKey);
  eleventyConfig.addLiquidFilter('where', where);
  eleventyConfig.addLiquidFilter('escape', escape);
  eleventyConfig.addLiquidFilter('jsonify', jsonify);
  eleventyConfig.addLiquidFilter('toHtml', toHtml);
  eleventyConfig.addLiquidFilter('toIsoString', toISOString);
  eleventyConfig.addLiquidFilter('dividedBy', dividedBy);
  eleventyConfig.addLiquidFilter('newlineToBr', newlineToBr);
  eleventyConfig.addLiquidFilter('toAbsoluteUrl', toAbsoluteUrl);
  eleventyConfig.addLiquidFilter('stripNewlines', stripNewlines);
  eleventyConfig.addLiquidFilter('stripHtml', stripHtml);
  eleventyConfig.addLiquidFilter('slugify', slugifyString);
  eleventyConfig.addLiquidFilter('unslugify', unslugify);
  eleventyConfig.addLiquidFilter('getNewestCollectionItemDate', pluginRss.getNewestCollectionItemDate);

  // Create custom collections
  eleventyConfig.addCollection('posts', posts);
  eleventyConfig.addCollection('categories', categories);
  eleventyConfig.addCollection('postsByCategory', postsByCategory);

  // Plugins
  eleventyConfig.addPlugin(syntaxHighlight, syntaxHighlightConfig);
  eleventyConfig.addPlugin(pluginRss, {
    posthtmlRenderOptions: {
      closingSingleTag: 'slash',
    },
  });

  // Libraries
  eleventyConfig.setLibrary('md', markdownLib);

  return {
    dir,
    dataTemplateEngine: 'liquid',
    markdownTemplateEngine: 'liquid',
    htmlTemplateEngine: 'liquid',
    templateFormats: ['html', 'liquid', 'md', '11ty.js'],
  };
};
