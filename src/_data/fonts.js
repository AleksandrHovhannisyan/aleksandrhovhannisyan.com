const path = require('path');
const fontPath = `/assets/fonts`;

const FontWeight = {
  REGULAR: 'regular',
  MEDIUM: 'medium',
  BOLD: 'bold',
};

const FontVariant = {
  LIGHT: 'Light',
  REGULAR: 'Regular',
  MEDIUM: 'Medium',
  BOLD: 'Bold',
  Italic: 'Italic',
  BOLDITALIC: 'Bold Italic',
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
    family: 'Georgia',
    fallbacks: ['serif'],
    hasFontFace: false,
    weights: {
      [FontWeight.REGULAR]: {
        variant: FontVariant.REGULAR,
        weight: 400,
        style: FontStyle.NORMAL,
      },
      [FontWeight.BOLD]: {
        variant: FontVariant.BOLD,
        weight: 700,
        style: FontStyle.NORMAL,
      },
    },
  },
  title: {
    family: 'Lato',
    fallbacks: [`Georgia`, `serif`],
    weights: {
      [FontWeight.REGULAR]: {
        variant: FontVariant.REGULAR,
        weight: 400,
        style: FontStyle.NORMAL,
        url: getFontUrl('lato-v20-latin-regular.woff2'),
        display: FontDisplay.SWAP,
      },
      [FontWeight.BOLD]: {
        variant: FontVariant.BOLD,
        weight: 900,
        style: FontStyle.NORMAL,
        url: getFontUrl('lato-v20-latin-900.woff2'),
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
  cursiveTitle: {
    family: 'Rock Salt',
    fallbacks: [`cursive`],
    weights: {
      [FontWeight.REGULAR]: {
        variant: FontVariant.REGULAR,
        weight: 400,
        style: FontStyle.NORMAL,
        url: getFontUrl('rock-salt-v11-latin-regular.woff2'),
        display: FontDisplay.SWAP,
      },
    },
  },
  cursiveBody: {
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
