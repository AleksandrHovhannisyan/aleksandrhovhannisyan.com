const markdownLib = require('../../plugins/markdown');
const outdent = require('outdent');

const aside = (children) => {
  const content = markdownLib.renderInline(children);
  return `<aside class="post-aside">${outdent`${content}`}</aside>`;
};

module.exports = aside;
