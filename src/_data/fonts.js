const path = require('path');
const fontPath = `/assets/fonts`;

const FontWeight = {
  REGULAR: 'regular',
  MEDIUM: 'medium',
  BOLD: 'bold',
  EXTRABOLD: 'extraBold',
  ITALIC: 'italic',
};

const FontVariant = {
  LIGHT: 'Light',
  REGULAR: 'Regular',
  MEDIUM: 'Medium',
  BOLD: 'Bold',
  EXTRABOLD: 'ExtraBold',
  ITALIC: 'Italic',
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
        variant: FontVariant.REGULAR,
        weight: 400,
        style: FontStyle.NORMAL,
        url: getFontUrl('rubik-latin-400.woff2'),
        display: FontDisplay.SWAP,
      },
      [FontWeight.ITALIC]: {
        variant: FontVariant.ITALIC,
        weight: 400,
        style: FontStyle.ITALIC,
        url: getFontUrl('rubik-latin-italic.woff2'),
        display: FontDisplay.SWAP,
      },
      [FontWeight.BOLD]: {
        variant: FontVariant.BOLD,
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
    weights: {
      [FontWeight.REGULAR]: {
        variant: FontVariant.REGULAR,
        weight: 400,
        style: FontStyle.NORMAL,
        url: getFontUrl('bitter-latin-400.woff2'),
        display: FontDisplay.SWAP,
      },
      [FontWeight.BOLD]: {
        variant: FontVariant.BOLD,
        weight: 700,
        style: FontStyle.NORMAL,
        url: getFontUrl('bitter-latin-700.woff2'),
        display: FontDisplay.SWAP,
      },
      [FontWeight.EXTRABOLD]: {
        variant: FontVariant.EXTRABOLD,
        weight: 800,
        style: FontStyle.NORMAL,
        url: getFontUrl('bitter-latin-800.woff2'),
        display: FontDisplay.SWAP,
      },
    },
  },
  code: {
    family: 'IBM Plex Mono',
    fallbacks: [`Monaco`, `Consolas`, `Courier New`, `monospace`],
    weights: {
      [FontWeight.REGULAR]: {
        variant: FontVariant.REGULAR,
        weight: 400,
        style: FontStyle.NORMAL,
        url: getFontUrl('ibm-plex-mono-v7-latin-regular.woff2'),
        display: FontDisplay.SWAP,
      },
      [FontWeight.MEDIUM]: {
        variant: FontVariant.MEDIUM,
        weight: 500,
        style: FontStyle.NORMAL,
        url: getFontUrl('ibm-plex-mono-v7-latin-500.woff2'),
        display: FontDisplay.SWAP,
      },
      [FontWeight.BOLD]: {
        variant: FontVariant.BOLD,
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
        variant: FontVariant.REGULAR,
        weight: 400,
        style: FontStyle.NORMAL,
        url: getFontUrl('reenie-beanie-v11-latin-regular.woff2'),
        display: FontDisplay.SWAP,
      },
    },
  },
};

module.exports = fonts;
