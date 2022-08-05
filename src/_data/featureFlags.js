module.exports = {
  // Explicit !== false check so we don't need to enable it by default
  enableComments: process.env.ENABLE_COMMENTS !== false && !!process.env.GITHUB_PERSONAL_ACCESS_TOKEN,
  enableDesignMode: process.env.ELEVENTY_ENV === 'development',
};
