const path = require('path');
const fontPath = `/assets/fonts`;

const FontWeight = {
  REGULAR: 'regular',
  ITALIC: 'italic',
  MEDIUM: 'medium',
  BOLD: 'bold',
  BOLDITALIC: 'boldItalic',
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
    family: 'Source Sans Pro',
    fallbacks: ['system-ui', 'sans-serif'],
    weights: {
      [FontWeight.REGULAR]: {
        variant: FontVariant.REGULAR,
        weight: 400,
        style: FontStyle.NORMAL,
        url: getFontUrl('source-sans-pro-latin-regular.woff2'),
        display: FontDisplay.SWAP,
      },
      [FontWeight.ITALIC]: {
        variant: FontVariant.Italic,
        weight: 400,
        style: FontStyle.ITALIC,
        url: getFontUrl('source-sans-pro-latin-italic.woff2'),
        display: FontDisplay.SWAP,
      },
      [FontWeight.BOLD]: {
        variant: FontVariant.BOLD,
        weight: 700,
        style: FontStyle.NORMAL,
        url: getFontUrl('source-sans-pro-latin-700.woff2'),
        display: FontDisplay.SWAP,
      },
      [FontWeight.BOLDITALIC]: {
        variant: FontVariant.BOLDITALIC,
        weight: 700,
        style: FontStyle.ITALIC,
        url: getFontUrl('source-sans-pro-latin-700italic.woff2'),
        display: FontDisplay.SWAP,
      },
    },
  },
  code: {
    family: 'Source Code Pro',
    fallbacks: [`Monaco`, `Consolas`, `Courier New`, `monospace`],
    weights: {
      [FontWeight.REGULAR]: {
        variant: FontVariant.REGULAR,
        weight: 400,
        style: FontStyle.NORMAL,
        url: getFontUrl('source-code-pro-latin-regular.woff2'),
        display: FontDisplay.SWAP,
      },
      [FontWeight.MEDIUM]: {
        variant: FontVariant.MEDIUM,
        weight: 500,
        style: FontStyle.NORMAL,
        url: getFontUrl('source-code-pro-latin-500.woff2'),
        display: FontDisplay.SWAP,
      },
      [FontWeight.BOLD]: {
        variant: FontVariant.BOLD,
        weight: 700,
        style: FontStyle.NORMAL,
        url: getFontUrl('source-code-pro-latin-700.woff2'),
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
