const path = require('path');
const { toAbsoluteImageUrl } = require('../../config/filters/filters');

module.exports = {
  layout: 'post',
  permalink: (data) => `/blog/${data?.page?.fileSlug}/`,
  isBlogPage: true,
  isPost: true,
  eleventyComputed: {
    scripts: (data) => {
      // If the post has comments, link to the comment script to load them
      if (data.commentsId) {
        // Spread in existing scripts and tack on the comment script
        return [...data.scripts, `/assets/scripts/comments.mjs`];
      }
    },
    openGraph: {
      // For social sharing. Used in og:image and twitter:image. Absolute path to the post's thumbnail image.
      // Thumbnails may be remote images (thumbnail.url) or local images (thumbnail as a string path, like ./images/thumbnail.png).
      image: async (data) => {
        // TODO: add a fallback social preview image
        if (!data.thumbnail) {
          return;
        }
        // inputPath will look like src/_posts/yyyy-mm-dd-slug/ for a post located under src/_posts/yyyy-mm-dd-slug/index.md
        const { dir: imgDir } = path.parse(data.page.inputPath);
        // either a full URL for remote images or src/_posts/yyyy-mm-dd-slug/images/name.extension for local images
        const src = data.thumbnail.url ?? path.join(imgDir, data.thumbnail);
        // for remote images, just the URL; else, a root-relative path to the image (as seen in the img tag's src)
        return toAbsoluteImageUrl(src);
      },
    },
  },
};
