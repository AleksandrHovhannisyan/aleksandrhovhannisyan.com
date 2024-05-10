const { FontVariant, FontStyle, FontDisplay } = require('../../config/fonts/fonts.constants');
const { getFontUrl } = require('../../config/fonts/fonts.utils');

/** Global font config. Gets compiled into font face declarations and can be reused anywhere to access font info.
 * Individual templates can define their own font overrides on an as-needed basis. See for example art.11tydata.js.
 * @type {import("../../types/fonts.typedefs").FontConfig}
 */
const fonts = {
  body: {
    type: 'variable',
    family: 'Source Sans',
    fallbacks: ['body-fallback-1', 'body-fallback-2', 'body-fallback-3', 'body-fallback-4'],
    weights: {
      [FontVariant.REGULAR]: 400,
      [FontVariant.BOLD]: 700,
    },
    variants: {
      roman: {
        style: FontStyle.REGULAR,
        url: getFontUrl('sourcesans-variable-latin-roman.woff2'),
        postscriptName: 'SourceSansVF',
        display: FontDisplay.SWAP,
        weights: {
          min: 200,
          max: 900,
        },
      },
      italic: {
        style: FontStyle.ITALIC,
        url: getFontUrl('sourcesans-variable-latin-italic.woff2'),
        postscriptName: 'SourceSansItalicVF',
        display: FontDisplay.SWAP,
        weights: {
          min: 200,
          max: 900,
        },
      },
    },
  },
  mono: {
    type: 'variable',
    family: 'Source Code Pro',
    fallbacks: [`mono-fallback`, `monospace`],
    metricOverrides: {
      sizeAdjust: 0.79,
      ascent: 0.94,
      descent: 0.26,
    },
    weightAxes: {
      min: 100,
      max: 900,
    },
    weights: {
      [FontVariant.REGULAR]: 400,
      [FontVariant.BOLD]: 700,
    },
    variants: {
      roman: {
        style: FontStyle.REGULAR,
        url: getFontUrl('sourcecode-latin-roman-variable.woff2'),
        postscriptName: 'SourceCodeVF',
        display: FontDisplay.SWAP,
      },
    },
  },
};

module.exports = fonts;
