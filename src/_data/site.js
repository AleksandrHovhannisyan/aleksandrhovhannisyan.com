module.exports = {
  title: 'Aleksandr Hovhannisyan',
  author: 'Aleksandr Hovhannisyan',
  email: 'aleksandrhovhannisyan@gmail.com',
  description:
    "Hey there! I'm Aleksandr. I write dev tutorials, share my thoughts on software development, and publish the occasional off-topic post.",
  keywords: ['Aleksandr Hovhannisyan'],
  // FIXME: don't hardcode port
  url: process.env.ELEVENTY_ENV === 'development' ? 'http://localhost:4001' : 'https://www.aleksandrhovhannisyan.com',
  issuesRepo: 'AleksandrHovhannisyan/aleksandrhovhannisyan.com',
  pagination: {
    itemsPerPage: 20,
  },
};
