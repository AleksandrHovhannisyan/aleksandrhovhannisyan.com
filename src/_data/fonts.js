const { FontVariant, FontStyle, FontDisplay } = require('../../config/fonts/fonts.constants');
const { getFontUrl } = require('../../config/fonts/fonts.utils');

/** Global font config. Gets compiled into font face declarations and can be reused anywhere to access font info.
 * Individual templates can define their own font overrides on an as-needed basis. See for example art.11tydata.js.
 * @type {import("../../types/fonts.typedefs").FontConfig}
 */
const fonts = {
  body: {
    type: 'static',
    family: 'PT Serif',
    fallbacks: [`body-fallback`],
    variants: {
      [FontVariant.REGULAR]: {
        roman: {
          weight: 400,
          style: FontStyle.NORMAL,
          url: getFontUrl('ptserif-latin-400-roman.woff2'),
          postscriptName: `PTSerif-Regular`,
          display: FontDisplay.SWAP,
        },
        italic: {
          weight: 400,
          style: FontStyle.ITALIC,
          url: getFontUrl('ptserif-latin-400-italic.woff2'),
          postscriptName: `PTSerif-Italic`,
          display: FontDisplay.SWAP,
        },
      },
      [FontVariant.BOLD]: {
        roman: {
          weight: 700,
          style: FontStyle.NORMAL,
          url: getFontUrl('ptserif-latin-700-roman.woff2'),
          postscriptName: `PTSerif-Bold`,
          display: FontDisplay.SWAP,
        },
        italic: {
          weight: 700,
          style: FontStyle.ITALIC,
          url: getFontUrl('ptserif-latin-700-italic.woff2'),
          postscriptName: `PTSerif-BoldItalic`,
          display: FontDisplay.SWAP,
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
