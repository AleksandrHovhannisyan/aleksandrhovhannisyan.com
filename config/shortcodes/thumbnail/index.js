const path = require('path');
const { toAbsoluteUrl } = require('../../filters');

/** Returns an absolute path to a post preview thumbnail. */
module.exports = function thumbnailShortcode(thumbnail) {
  if (/^https?:\/\//.test(thumbnail)) {
    return thumbnail;
  }
  return toAbsoluteUrl(path.join('/assets/images/posts', this.page.fileSlug, thumbnail));
};
