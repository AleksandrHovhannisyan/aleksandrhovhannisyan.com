const pluginRss = require('@11ty/eleventy-plugin-rss');
const pluginSass = require('eleventy-plugin-sass');
const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');
const sassConfig = require('./config/plugins/sass');
const syntaxHighlightConfig = require('./config/plugins/syntaxHighlighter');
const imageShortcode = require('./config/shortcodes/image');
const iconShortcode = require('./config/shortcodes/icon');
const socialIconShortcode = require('./config/shortcodes/socialIcon');
const {
  wordCount,
  limit,
  includes,
  remove,
  sortByKey,
  toHtml,
  escape,
  jsonify,
  where,
  toISOString,
} = require('./config/filters');
const { posts, categories, postsByCategory } = require('./config/collections');
const markdownLib = require('./config/plugins/markdown');
const { dir, imagePaths } = require('./config/constants');

module.exports = (eleventyConfig) => {
  // Pass-through copy for static assets
  eleventyConfig.addPassthroughCopy(`${dir.input}/${dir.assets}/fonts`);
  eleventyConfig.addPassthroughCopy(`${imagePaths.source}/favicons`);
  eleventyConfig.addPassthroughCopy(`${imagePaths.source}/art`);
  eleventyConfig.addPassthroughCopy(`${imagePaths.source}/404`);
  // Netlify redirects file needs to be copied to output dir
  eleventyConfig.addPassthroughCopy('src/_redirects');

  // Register custom shortcodes
  eleventyConfig.addLiquidShortcode('image', imageShortcode);
  eleventyConfig.addLiquidShortcode('icon', iconShortcode);
  eleventyConfig.addLiquidShortcode('socialIcon', socialIconShortcode);

  // Register custom filters
  eleventyConfig.addLiquidFilter('word_count', wordCount);
  eleventyConfig.addLiquidFilter('limit', limit);
  eleventyConfig.addLiquidFilter('includes', includes);
  eleventyConfig.addLiquidFilter('remove', remove);
  eleventyConfig.addLiquidFilter('sort_by_key', sortByKey);
  eleventyConfig.addLiquidFilter('where', where);
  eleventyConfig.addLiquidFilter('escape', escape);
  eleventyConfig.addLiquidFilter('jsonify', jsonify);
  eleventyConfig.addLiquidFilter('to_html', toHtml);
  eleventyConfig.addLiquidFilter('to_iso_string', toISOString);
  eleventyConfig.addLiquidFilter('getNewestCollectionItemDate', pluginRss.getNewestCollectionItemDate);
  eleventyConfig.addLiquidFilter('absoluteUrl', pluginRss.absoluteUrl);
  eleventyConfig.addLiquidFilter('convertHtmlToAbsoluteUrls', pluginRss.convertHtmlToAbsoluteUrls);

  // Create custom collections
  eleventyConfig.addCollection('posts', posts);
  eleventyConfig.addCollection('categories', categories);
  eleventyConfig.addCollection('postsByCategory', postsByCategory);

  // Plugins
  eleventyConfig.addPlugin(syntaxHighlight, syntaxHighlightConfig);
  eleventyConfig.addPlugin(pluginSass, sassConfig);
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
