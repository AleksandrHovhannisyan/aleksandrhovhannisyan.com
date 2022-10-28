const path = require('path');
const { dir } = require('../../config/constants');
const fontkit = require('fontkit');
const cloneDeep = require('lodash/cloneDeep');

const FontVariant = {
  REGULAR: 'regular',
  MEDIUM: 'medium',
  BOLD: 'bold',
};

const FontStyle = {
  NORMAL: 'normal',
  ITALIC: 'italic',
};

const FontDisplay = {
  SWAP: 'swap',
};

/** Helper to auto-prefix a font src url with the path to local fonts. */
const getFontUrl = (src) => path.join(`/assets/fonts`, src);

/** Global font config. Gets compiled into font face declarations and can be reused anywhere to access font info.
 * @type {FontConfig}
 */
const fonts = {
  body: {
    family: 'Fira Sans',
    fallbacks: [`Sans-fallback`],
    variants: {
      [FontVariant.REGULAR]: {
        roman: {
          weight: 400,
          style: FontStyle.NORMAL,
          url: getFontUrl('firasans-latin-400-roman.woff2'),
          display: FontDisplay.SWAP,
        },
        italic: {
          weight: 400,
          style: FontStyle.ITALIC,
          url: getFontUrl('firasans-latin-400-italic.woff2'),
          display: FontDisplay.SWAP,
        },
      },
      [FontVariant.BOLD]: {
        roman: {
          weight: 700,
          style: FontStyle.NORMAL,
          url: getFontUrl('firasans-latin-700-roman.woff2'),
          display: FontDisplay.SWAP,
        },
      },
    },
  },
  mono: {
    family: 'IBM Plex Mono',
    fallbacks: [`Monaco`, `Consolas`, `Courier New`, `monospace`],
    variants: {
      [FontVariant.REGULAR]: {
        roman: {
          weight: 400,
          style: FontStyle.NORMAL,
          url: getFontUrl('ibmplexmono-latin-400-roman.woff2'),
          display: FontDisplay.SWAP,
        },
      },
      [FontVariant.MEDIUM]: {
        roman: {
          weight: 500,
          style: FontStyle.NORMAL,
          url: getFontUrl('ibmplexmono-latin-500-roman.woff2'),
          display: FontDisplay.SWAP,
        },
      },
      [FontVariant.BOLD]: {
        roman: {
          weight: 700,
          style: FontStyle.NORMAL,
          url: getFontUrl('ibmplexmono-latin-700-roman.woff2'),
          display: FontDisplay.SWAP,
        },
      },
    },
  },
  artCursive: {
    family: 'Reenie Beanie',
    fallbacks: [`cursive`],
    variants: {
      [FontVariant.REGULAR]: {
        roman: {
          weight: 400,
          style: FontStyle.NORMAL,
          url: getFontUrl('reeniebeanie-latin-400-roman.woff2'),
          display: FontDisplay.SWAP,
        },
      },
    },
  },
  artDisplay: {
    family: 'Rampart One',
    fallbacks: [`Sans-fallback`],
    variants: {
      [FontVariant.REGULAR]: {
        roman: {
          weight: 400,
          style: FontStyle.NORMAL,
          url: getFontUrl('rampartone-latin-400-roman.woff2'),
          display: FontDisplay.SWAP,
        },
      },
    },
  },
};

/** Injects postcript names into each font config definition.
 * @param {FontConfig} fontConfig
 */
const withPostscriptNames = (fontConfig) => {
  const fontsCopy = cloneDeep(fontConfig);
  Object.values(fontsCopy).forEach((font) => {
    // Variable font
    if (font.weightAxes) {
      font.postscriptName = font.family.replace(/\s/g, '');
    } else {
      // Non-variable fonts need one postscript name per weight variant
      Object.values(font.variants).forEach((variant) => {
        Object.values(variant).forEach((weight) => {
          const fontFile = fontkit.openSync(path.join(dir.input, weight.url));
          weight.postscriptName = fontFile.postscriptName;
        });
      });
    }
  });
  return fontsCopy;
};

module.exports = withPostscriptNames(fonts);
