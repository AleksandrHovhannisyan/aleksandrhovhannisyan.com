const path = require('path');
const { toAbsoluteUrl } = require('../../filters');

/** Returns an absolute path to a post preview thumbnail. */
module.exports = function thumbnailShortcode(thumbnail, imagesDir) {
  if (thumbnail.url) {
    return thumbnail.url;
  }
  if (/^https?:\/\//.test(thumbnail)) {
    return thumbnail;
  }
  return toAbsoluteUrl(path.join(imagesDir, this.page.fileSlug, thumbnail));
};
