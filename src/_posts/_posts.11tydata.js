const path = require('path');
const imageShortcode = require('../../config/shortcodes/image');
const { toAbsoluteUrl } = require('../../config/filters');

module.exports = {
  layout: 'post',
  permalink: (data) => `/blog/${data?.page?.fileSlug}/`,
  isBlogPage: true,
  isPost: true,
  eleventyComputed: {
    ogImage: async (data) => {
      const urlPath = path.join(`/assets/images/posts/`, data.page.fileSlug);
      const src = data.thumbnail.url ?? path.join(urlPath, data.thumbnail);

      const url = await imageShortcode({
        src,
        urlPath,
        fileName: 'thumbnail',
        widths: [180, 360, 800, 1280],
        sizes: `(max-width: 400px) 360px, (max-width: 768px) 800px, 360px`,
        shouldReturnUrl: true,
      });
      return toAbsoluteUrl(url);
    },
  },
};
