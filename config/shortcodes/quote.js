const { escape } = require('lodash');
const markdownLib = require('../plugins/markdown');

const quote = (children, source, cite) => {
  if (!/https?:\/\//.test(cite)) {
    throw new Error(`Quote citation is not a recognized url: ${cite}.`);
  }
  if (!source) {
    throw new Error('Quotes must attribute a source.');
  }
  if (!children) {
    throw new Error('Quotes must have non-empty content.');
  }
  const content = markdownLib.render(children.trim());
  return `<blockquote class="rhythm" cite="${cite}">
    <div class="quote rhythm">${content}</div>
    <footer>
      <cite><a href="${escape(cite)}" target="_blank" rel="noreferrer noopener">${source}</a></cite>
    </footer>
  </blockquote>`;
};

module.exports = quote;
