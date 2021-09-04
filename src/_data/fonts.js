const path = require('path');
const fontPath = `/assets/fonts`;

const fonts = {
  main: {
    light: path.join(fontPath, 'fira-sans-v10-latin-300.woff2'),
    regular: path.join(fontPath, 'fira-sans-v10-latin-regular.woff2'),
    regularItalic: path.join(fontPath, 'fira-sans-v10-latin-italic.woff2'),
    bold: path.join(fontPath, 'fira-sans-v10-latin-700.woff2'),
    boldItalic: path.join(fontPath, 'fira-sans-v10-latin-700italic.woff2'),
  },
  code: {
    regular: path.join(fontPath, 'inconsolata-v20-latin-500.woff2'),
    bold: path.join(fontPath, 'inconsolata-v20-latin-700.woff2'),
  },
  cursive: {
    title: path.join(fontPath, 'rock-salt-v11-latin-regular.woff2'),
    body: path.join(fontPath, 'reenie-beanie-v11-latin-regular.woff2'),
  },
};

module.exports = fonts;
