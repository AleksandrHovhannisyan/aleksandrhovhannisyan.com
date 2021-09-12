const { escape } = require('lodash');
const { outdent } = require('outdent');
const { newlineToBr } = require('../../filters');
const markdownLib = require('../../plugins/markdown');

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
  const content = markdownLib.renderInline(newlineToBr(children.trim()));
  return outdent`<blockquote cite="${cite}">
    <div class="quote-content">${content}</div>
    <div class="quote-source">—<cite><a href="${escape(cite)}">${source}</a></cite></div>
  </blockquote>`;
};

module.exports = quote;
