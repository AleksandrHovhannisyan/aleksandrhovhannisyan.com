const { escape } = require('lodash');
const { outdent } = require('outdent');
const { newlineToBr } = require('../../filters');
const markdownLib = require('../../plugins/markdown');

const quote = (children, source, cite) => {
  const content = markdownLib.renderInline(newlineToBr(children.trim()));
  return outdent`<blockquote cite="${cite}">
    <div class="quote-content">${content}</div>
    <div class="quote-source">—<cite><a href="${escape(cite)}">${source}</a></cite></div>
  </blockquote>`;
};

module.exports = quote;
