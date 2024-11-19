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
  fetchText,
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
import { dir, imagePaths, scriptDirs } from './lib/constants.js';
import { escape, slugifyString } from './lib/utils.js';

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
  eleventyConfig.setServerPassthroughCopyBehavior('copy');
  eleventyConfig.addPassthroughCopy(path.join(dir.input, dir.assets, 'fonts'));
  eleventyConfig.addPassthroughCopy(path.join(dir.input, dir.assets, 'videos'));

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
  eleventyConfig.addShortcode('fetchText', fetchText);

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
        path.join(scriptDirs.input, 'copyCode.js'),
        path.join(scriptDirs.input, 'demos/carousel.js'),
        path.join(scriptDirs.input, 'demos/gameLoop.js'),
        path.join(scriptDirs.input, 'comments.js'),
      ],
      entryNames: '[dir]/[name]',
      outdir: scriptDirs.output,
      format: 'esm',
      outExtension: { '.js': '.js' },
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
}
