const path = require('path');
const { dir } = require('../../config/constants');
const { toAbsoluteImageUrl } = require('../../config/filters');

module.exports = {
  layout: 'post',
  permalink: (data) => `/blog/${data?.page?.fileSlug}/`,
  isBlogPage: true,
  isPost: true,
  eleventyComputed: {
    // For social sharing. Used in og:image and twitter:image. Absolute path to the post's thumbnail image.
    // Thumbnails may be remote images (thumbnail.url) or local images (thumbnail as a string path, like ./images/thumbnail.png).
    ogImage: async (data) => {
      // filePathStem will look like _posts/yyyy-mm-dd-slug/ for a post located under src/_posts/yyyy-mm-dd-slug/index.md
      const { dir: imgDir } = path.parse(data.page.filePathStem);
      // either a full URL for remote images or src/_posts/yyyy-mm-dd-slug/images/name.extension for local images
      const src = data.thumbnail.url ?? path.join(dir.input, imgDir, data.thumbnail);
      // for remote images, just the URL; else, a root-relative path to the image (as seen in the img tag's src)
      return toAbsoluteImageUrl(src);
    },
  },
};
