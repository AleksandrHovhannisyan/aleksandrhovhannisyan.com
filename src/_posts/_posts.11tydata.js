// const imageShortcode = require('../../config/shortcodes/image');

// module.exports = {
//   layout: 'post',
//   permalink: (data) => `/blog/${data?.page?.fileSlug}/`,
//   isBlogPage: true,
//   isPost: true,
//   eleventyComputed: {
//     ogImage: async (data) => {
//       const urlPath = `/assets/images/posts/${data.page.fileSlug}/`;

//       console.log(`data.thumbnail`, data.thumbnail);

//       // https://github.com/11ty/eleventy/issues/2240
//       if (!typeof data.thumbnail === 'object' && !Object.keys(data.thumbnail).length) {
//         return;
//       }

//       const src = data.thumbnail.url ?? `${urlPath}${data.thumbnail}`;

//       console.log(`og image src`, src);

//       return imageShortcode({
//         src,
//         urlPath,
//         widths: [180, 360, 800, 1280],
//         sizes: `(max-width: 400px) 360px, (max-width: 768px) 800px, 360px`,
//         shouldReturnUrl: true,
//       });
//     },
//   },
// };
