export default {
  layout: 'note',
  tags: ['notes'],
  permalink: (data) => `/notes/${data?.page?.fileSlug}/`,
  eleventyComputed: {
    scripts: (data) => {
      return [
        ...data.scripts,
        {
          type: 'module',
          src: '/assets/scripts/copyCode.js',
        },
      ];
    },
  },
};
