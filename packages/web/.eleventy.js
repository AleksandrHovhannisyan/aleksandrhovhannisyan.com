import esbuild from 'esbuild';
import path from 'node:path';
import PluginFootnotes from 'eleventy-plugin-footnotes';
import { EleventyPluginCodeDemo } from 'eleventy-plugin-code-demo';
import { eleventyImageTransformPlugin } from '@11ty/eleventy-img';
import {
  asideShortcode,
  definitionShortcode,
  iconShortcode,
  quoteShortcode,
  faviconShortcode,
  artworkShortcode,
  hashArtShortcode,
  nanoIdShortcode,
  detailsShortcode,
  stylesheetShortcode,
  fetchTextShortcode,
} from './lib/shortcodes/index.js';
import {
  limit,
  sortByKey,
  toHtml,
  where,
  toISOString,
  formatDate,
  toAbsoluteUrl,
  getLatestCollectionItemDate,
  cleanCSS,
  minifyJS,
  toAbsoluteImageUrl,
  pathParse,
  pathJoin,
} from './lib/filters.js';
import { getAllPosts, getAllUniqueCategories, getPostsByCategory } from './lib/collections.js';
import { markdown } from './lib/plugins/markdown.js';
import { codeDemoOptions } from './lib/plugins/codeDemo.js';
import { escape, slugifyString } from './lib/utils.js';

const TEMPLATE_ENGINE = 'liquid';

const isProductionBuild = process.env.ELEVENTY_ENV === 'production';

export default function eleventy(eleventyConfig) {
  eleventyConfig.setLiquidOptions({
    // Allows for dynamic include/partial names. If true, include names must be quoted. Defaults to true as of beta/1.0.
    dynamicPartials: true,
  });

  // Watch targets
  eleventyConfig.addWatchTarget('src/assets/images');
  eleventyConfig.addWatchTarget('src/assets/scripts');

  // Pass-through copy for static assets
  eleventyConfig.setServerPassthroughCopyBehavior('copy');
  eleventyConfig.addPassthroughCopy('src/assets/fonts');
  eleventyConfig.addPassthroughCopy('src/*.pdf');
  eleventyConfig.addPassthroughCopy('src/_posts/**/videos/*', {
    mode: "html-relative",
    failOnError: true,
  });

  // Custom shortcodes
  eleventyConfig.addPairedShortcode('aside', asideShortcode);
  eleventyConfig.addPairedShortcode('quote', quoteShortcode);
  eleventyConfig.addPairedShortcode('definition', definitionShortcode);
  eleventyConfig.addPairedShortcode('artwork', artworkShortcode);
  eleventyConfig.addPairedShortcode('details', detailsShortcode);
  eleventyConfig.addShortcode('favicon', faviconShortcode);
  eleventyConfig.addShortcode('icon', iconShortcode);
  eleventyConfig.addShortcode('hashArt', hashArtShortcode);
  eleventyConfig.addShortcode('nanoid', nanoIdShortcode);
  eleventyConfig.addShortcode('fetchText', fetchTextShortcode);
  eleventyConfig.addShortcode('stylesheet', stylesheetShortcode);

  // Custom filters
  eleventyConfig.addFilter('limit', limit);
  eleventyConfig.addFilter('sortByKey', sortByKey);
  eleventyConfig.addFilter('where', where);
  eleventyConfig.addFilter('escape', escape);
  eleventyConfig.addFilter('toHtml', toHtml);
  eleventyConfig.addFilter('toISOString', toISOString);
  eleventyConfig.addFilter('formatDate', formatDate);
  eleventyConfig.addFilter('toAbsoluteUrl', toAbsoluteUrl);
  eleventyConfig.addFilter('toAbsoluteImageUrl', toAbsoluteImageUrl);
  eleventyConfig.addFilter('slugify', slugifyString);
  eleventyConfig.addFilter('jsonStringify', JSON.stringify);
  eleventyConfig.addFilter('jsonParse', JSON.parse);
  eleventyConfig.addFilter('getLatestCollectionItemDate', getLatestCollectionItemDate);
  eleventyConfig.addFilter('cleanCSS', cleanCSS);
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
  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
    // which file extensions to process
    extensions: 'html',
    // optional, output image formats
    formats: ['jpg', 'webp'],
    // optional, output image widths
    widths: ['auto', 400, 800],
    // optional, attributes assigned on <img> override these values.
    defaultAttributes: {
      loading: 'lazy',
      sizes: '100vw',
      decoding: 'async',
    },
    sharpOptions: {
      animated: true,
    },
  });
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
        'src/assets/scripts/copyCode.js',
        'src/assets/scripts/comments.js',
        'src/assets/scripts/dialog.js',
        'src/assets/scripts/demos/carousel.js',
        'src/assets/scripts/demos/gameLoop.js',
      ],
      entryNames: '[dir]/[name]',
      outdir: 'dist/assets/scripts',
      format: 'esm',
      bundle: true,
      splitting: true,
      minify: isProductionBuild,
      sourcemap: !isProductionBuild,
      loader: {
        '.svg': 'text',
      },
    });
  });

  return {
    dir: {
      input: 'src',
      output: 'dist',
      includes: '_includes',
      layouts: '_layouts',
      data: '_data',
    },
    dataTemplateEngine: TEMPLATE_ENGINE,
    markdownTemplateEngine: TEMPLATE_ENGINE,
    htmlTemplateEngine: TEMPLATE_ENGINE,
    templateFormats: ['html', 'md', TEMPLATE_ENGINE],
  };
}
