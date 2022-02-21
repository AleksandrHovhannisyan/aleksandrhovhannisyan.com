const path = require('path');
const Image = require('@11ty/eleventy-img');
const { dir } = require('../constants');
const { parseImage } = require('../utils');
const site = require('../../src/_data/site');

/** Returns link tags for the site's favicon. */
async function faviconShortcode(src) {
  const favicon = parseImage(src);

  const props = {
    widths: site.favicon.widths,
    formats: [site.favicon.format],
    outputDir: path.join(dir.output, favicon.dir),
    urlPath: favicon.dir,
    filenameFormat: (_hash, _src, width, format) => {
      return `${favicon.name}-${width}.${format}`;
    },
  };

  const metadata = await Image(favicon.src, props);

  return metadata[site.favicon.format]
    .map((image) => `<link rel="icon" href="${image.url}" sizes="${image.width}x${image.width}">`)
    .join('\n');
}

module.exports = faviconShortcode;
