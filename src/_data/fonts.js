const path = require('path');
const { dir } = require('../../config/constants');
const fontPath = `/assets/fonts`;
const fontkit = require('fontkit');

const FontWeight = {
  REGULAR: 'regular',
  REGULARITALIC: 'italic',
  MEDIUM: 'medium',
  BOLD: 'bold',
  EXTRABOLD: 'extraBold',
};

const FontStyle = {
  NORMAL: 'normal',
  ITALIC: 'italic',
};

const FontDisplay = {
  SWAP: 'swap',
};

/** Helper to auto-prefix a font src url with the path to local fonts. */
const getFontUrl = (src) => path.join(fontPath, src);

/** Global font config. Gets compiled into font face declarations and can be reused anywhere to access font info. */
const fonts = {
  body: {
    family: 'Rubik',
    fallbacks: [`Rubik-fallback`],
    weights: {
      [FontWeight.REGULAR]: {
        weight: 400,
        style: FontStyle.NORMAL,
        url: getFontUrl('rubik-latin-400.woff2'),
        display: FontDisplay.SWAP,
      },
      [FontWeight.REGULARITALIC]: {
        weight: 400,
        style: FontStyle.ITALIC,
        url: getFontUrl('rubik-latin-italic.woff2'),
        display: FontDisplay.SWAP,
      },
      [FontWeight.BOLD]: {
        weight: 700,
        style: FontStyle.NORMAL,
        url: getFontUrl('rubik-latin-700.woff2'),
        display: FontDisplay.SWAP,
      },
    },
  },
  title: {
    family: 'Bitter',
    fallbacks: [`Bitter-fallback`],
    isVariable: true,
    style: FontStyle.NORMAL,
    url: getFontUrl('bitter-latin-variable.woff2'),
    display: FontDisplay.SWAP,
    variableWeights: {
      min: 100,
      max: 900,
    },
    weights: {
      [FontWeight.REGULAR]: {
        weight: 400,
      },
      [FontWeight.BOLD]: {
        weight: 750,
      },
    },
  },
  code: {
    family: 'IBM Plex Mono',
    fallbacks: [`Monaco`, `Consolas`, `Courier New`, `monospace`],
    weights: {
      [FontWeight.REGULAR]: {
        weight: 400,
        style: FontStyle.NORMAL,
        url: getFontUrl('ibm-plex-mono-v7-latin-regular.woff2'),
        display: FontDisplay.SWAP,
      },
      [FontWeight.MEDIUM]: {
        weight: 500,
        style: FontStyle.NORMAL,
        url: getFontUrl('ibm-plex-mono-v7-latin-500.woff2'),
        display: FontDisplay.SWAP,
      },
      [FontWeight.BOLD]: {
        weight: 700,
        style: FontStyle.NORMAL,
        url: getFontUrl('ibm-plex-mono-v7-latin-700.woff2'),
        display: FontDisplay.SWAP,
      },
    },
  },
  cursive: {
    family: 'Reenie Beanie',
    fallbacks: [`cursive`],
    weights: {
      [FontWeight.REGULAR]: {
        weight: 400,
        style: FontStyle.NORMAL,
        url: getFontUrl('reenie-beanie-v11-latin-regular.woff2'),
        display: FontDisplay.SWAP,
      },
    },
  },
};

/** Injects poscript names into each font config definition */
const withPostscriptNames = (fontConfig) => {
  // No need to clone deep
  const enhancedFonts = Object.assign({}, fontConfig);
  Object.values(enhancedFonts).forEach((font) => {
    // Variable fonts don't have individual variant configs, so inject in the top-level object
    if (font.isVariable) {
      const fontFile = fontkit.openSync(path.join(dir.input, font.url));
      font.postscriptName = fontFile.postscriptName;
    } else {
      // Non-variable fonts need one postscript name per weight variant
      Object.values(font.weights).forEach((weight) => {
        const fontFile = fontkit.openSync(path.join(dir.input, weight.url));
        weight.postscriptName = fontFile.postscriptName;
      });
    }
  });
  return enhancedFonts;
};

module.exports = withPostscriptNames(fonts);
