module.exports = {
  enableComments: !!process.env.GITHUB_PERSONAL_ACCESS_TOKEN,
  enableDesignMode: process.env.ELEVENTY_ENV === 'development',
};
