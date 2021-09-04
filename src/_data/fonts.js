const path = require('path');
const fontPath = `/assets/fonts`;

const FontStyle = {
  NORMAL: 'normal',
  ITALIC: 'italic',
};

const FontDisplay = {
  SWAP: 'swap',
};

/** Helper to auto-prefix a font src url with the path to local fonts. */
const getFontSrc = (src) => path.join(fontPath, src);

/** Global font config. Gets compiled into font face declarations and can be reused anywhere to access font info. */
const fonts = {
  main: {
    family: 'Fira Sans',
    weights: {
      light: {
        weight: 300,
        style: FontStyle.NORMAL,
        local: 'Fira Sans Light',
        url: getFontSrc('fira-sans-v10-latin-300.woff2'),
        display: FontDisplay.SWAP,
      },
      regular: {
        weight: 400,
        style: FontStyle.NORMAL,
        local: 'Fira Sans Regular',
        url: getFontSrc('fira-sans-v10-latin-regular.woff2'),
        display: FontDisplay.SWAP,
      },
      regularItalic: {
        weight: 400,
        style: FontStyle.ITALIC,
        local: 'Fira Sans Italic',
        url: getFontSrc('fira-sans-v10-latin-italic.woff2'),
        display: FontDisplay.SWAP,
      },
      bold: {
        weight: 700,
        style: FontStyle.NORMAL,
        local: 'Fira Sans Bold',
        url: getFontSrc('fira-sans-v10-latin-700.woff2'),
        display: FontDisplay.SWAP,
      },
      boldItalic: {
        weight: 700,
        style: FontStyle.ITALIC,
        local: 'Fira Sans BoldItalic',
        url: getFontSrc('fira-sans-v10-latin-700italic.woff2'),
        display: FontDisplay.SWAP,
      },
    },
  },
  code: {
    family: 'Inconsolata',
    weights: {
      regular: {
        weight: 500,
        style: FontStyle.NORMAL,
        local: 'Inconsolata',
        url: getFontSrc('inconsolata-v20-latin-500.woff2'),
        display: FontDisplay.SWAP,
      },
      bold: {
        weight: 700,
        style: FontStyle.NORMAL,
        local: 'Inconsolata Bold',
        url: getFontSrc('inconsolata-v20-latin-700.woff2'),
        display: FontDisplay.SWAP,
      },
    },
  },
  cursiveTitle: {
    family: 'Rock Salt',
    weights: {
      regular: {
        weight: 400,
        style: FontStyle.NORMAL,
        local: 'Rock Salt',
        url: path.join(fontPath, 'rock-salt-v11-latin-regular.woff2'),
        display: FontDisplay.SWAP,
      },
    },
  },
  cursiveBody: {
    family: 'Reenie Beanie',
    weights: {
      regular: {
        weight: 400,
        style: FontStyle.NORMAL,
        local: 'Reenie Beanie',
        url: path.join(fontPath, 'reenie-beanie-v11-latin-regular.woff2'),
        display: FontDisplay.SWAP,
      },
    },
  },
};

module.exports = fonts;
