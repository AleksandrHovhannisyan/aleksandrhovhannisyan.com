const { GITHUB_PERSONAL_ACCESS_TOKEN, ELEVENTY_ENV } = process.env;

const environmentSpecificVariables = {
  development: {
    // FIXME: don't hardcode port
    url: 'http://localhost:4001',
  },
  production: {
    url: 'https://www.aleksandrhovhannisyan.com',
  },
};

const featureFlags = {
  enableComments: !!GITHUB_PERSONAL_ACCESS_TOKEN,
};

module.exports = {
  title: 'Aleksandr Hovhannisyan',
  author: 'Aleksandr Hovhannisyan',
  email: 'aleksandrhovhannisyan@gmail.com',
  description: 'Programming tutorials, thoughts on software development, and the occasional off-topic post.',
  keywords: ['Aleksandr Hovhannisyan'],
  issues: {
    owner: `AleksandrHovhannisyan`,
    repo: `aleksandrhovhannisyan.com`,
  },
  favicon: {
    widths: [32, 57, 76, 96, 128, 192, 228],
    format: 'png',
  },
  pagination: {
    itemsPerPage: 20,
  },
  featureFlags: {
    ...featureFlags,
  },
  ...environmentSpecificVariables[ELEVENTY_ENV],
};
