const { FontVariant, FontStyle, FontDisplay } = require('../../config/fonts/fonts.constants');
const { getFontUrl } = require('../../config/fonts/fonts.utils');

/** Global font config. Gets compiled into font face declarations and can be reused anywhere to access font info.
 * Individual templates can define their own font overrides on an as-needed basis. See for example art.11tydata.js.
 * @type {import("../../config/fonts/fonts.typedefs").FontConfig}
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
    type: 'static',
    family: 'IBM Plex Mono',
    fallbacks: [`Monaco`, `Consolas`, `Courier New`, `monospace`],
    variants: {
      [FontVariant.REGULAR]: {
        roman: {
          weight: 400,
          style: FontStyle.NORMAL,
          url: getFontUrl('ibmplexmono-latin-400-roman.woff2'),
          postscriptName: `IBMPlexMono-Regular`,
          display: FontDisplay.SWAP,
        },
      },
      [FontVariant.MEDIUM]: {
        roman: {
          weight: 500,
          style: FontStyle.NORMAL,
          url: getFontUrl('ibmplexmono-latin-500-roman.woff2'),
          postscriptName: `IBMPlexMono-Medium`,
          display: FontDisplay.SWAP,
        },
      },
      [FontVariant.BOLD]: {
        roman: {
          weight: 700,
          style: FontStyle.NORMAL,
          url: getFontUrl('ibmplexmono-latin-700-roman.woff2'),
          postscriptName: `IBMPlexMono-Bold`,
          display: FontDisplay.SWAP,
        },
      },
    },
  },
};

module.exports = fonts;
