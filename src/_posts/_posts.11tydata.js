const path = require('path');
const { toAbsoluteImageUrl } = require('../../config/filters');

module.exports = {
  layout: 'post',
  permalink: (data) => `/blog/${data?.page?.fileSlug}/`,
  isBlogPage: true,
  isPost: true,
  eleventyComputed: {
    ogImage: async (data) => {
      const src = data.thumbnail.url ?? path.join(`/assets/images/posts/`, data.page.fileSlug, data.thumbnail);
      return toAbsoluteImageUrl(src);
    },
  },
};
