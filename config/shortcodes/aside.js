const markdownLib = require('../plugins/markdown');

const aside = (children) => {
  if (!children) {
    throw new Error('You must provide a non-empty string for an aside.');
  }
  const content = markdownLib.render(children);
  return `<aside role="note" class="post-aside rhythm">${content}</aside>`;
};

module.exports = aside;
