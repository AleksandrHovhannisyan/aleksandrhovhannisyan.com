const { escape } = require('lodash');
const { makeMarkdownParser } = require('../plugins/markdown');

// For multi-line quotes (e.g., stanzas in a poem or song), I don't want to have to manually insert <br> in place of newlines. The default markdown parser turns this off in favor of newlines. Making a new parser here to avoid mutating the global one.
const markdown = makeMarkdownParser().set({ breaks: true });

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
  const content = markdown.render(children.trim());
  return `<blockquote class="rhythm" cite="${cite}">
    <div class="rhythm">${content}</div>
    <footer>
      <cite>
        <a href="${escape(cite)}" target="_blank" rel="noreferrer noopener">${markdown.renderInline(source)}</a>
      </cite>
    </footer>
  </blockquote>`;
};

module.exports = quote;
