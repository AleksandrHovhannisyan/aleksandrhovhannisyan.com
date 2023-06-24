const environmentSpecificVariables = {
  development: {
    // FIXME: don't hardcode port
    url: 'http://localhost:4001',
  },
  production: {
    url: 'https://www.aleksandrhovhannisyan.com',
  },
};

module.exports = {
  title: 'Aleksandr Hovhannisyan',
  author: 'Aleksandr Hovhannisyan',
  email: 'aleksandrhovhannisyan@gmail.com',
  description: 'Dev tutorials, thoughts on software development, and the occasional essay.',
  keywords: ['Aleksandr Hovhannisyan'],
  lang: 'en-US',
  issues: {
    owner: `AleksandrHovhannisyan`,
    repo: `aleksandrhovhannisyan.com`,
  },
  pagination: {
    itemsPerPage: 21,
  },
  ...environmentSpecificVariables[process.env.ELEVENTY_ENV],
};
