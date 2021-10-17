const { GITHUB_PERSONAL_ACCESS_TOKEN } = process.env;

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
  description: 'Dev tutorials, thoughts on software development, and the occasional off-topic post.',
  keywords: ['Aleksandr Hovhannisyan'],
  // TODO: read from package.json?
  issues: {
    owner: `AleksandrHovhannisyan`,
    repo: `aleksandrhovhannisyan.com`,
  },
  pagination: {
    itemsPerPage: 20,
  },
  featureFlags: {
    ...featureFlags,
  },
  ...environmentSpecificVariables[process.env.ELEVENTY_ENV],
};
