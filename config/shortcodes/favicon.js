const path = require('path');
const Image = require('@11ty/eleventy-img');
const { dir } = require('../constants');
const { parseImage } = require('../utils');

const FAVICON_FORMAT = 'png';
const APPLE_TOUCH_ICON_WIDTH = 180;

/** Returns link tags for the site's favicon. */
async function faviconShortcode(src) {
  const favicon = parseImage(src);

  const props = {
    widths: [16, 32, 57, 76, 96, 128, APPLE_TOUCH_ICON_WIDTH, 192, 228],
    formats: [FAVICON_FORMAT],
    outputDir: path.join(dir.output, favicon.dir),
    urlPath: favicon.dir,
    filenameFormat: (_hash, _src, width, format) => {
      return `${favicon.name}-${width}.${format}`;
    },
  };

  const metadata = await Image(favicon.src, props);
  return metadata[FAVICON_FORMAT].map((image) => {
    const rel = image.width === APPLE_TOUCH_ICON_WIDTH ? 'apple-touch-icon' : 'icon';
    const sizes = `${image.width}x${image.width}`;
    return `<link rel="${rel}" href="${image.url}" sizes="${sizes}">`;
  }).join('\n');
}

module.exports = faviconShortcode;
