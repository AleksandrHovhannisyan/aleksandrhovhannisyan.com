import { makeMarkdownParser } from '../plugins/markdown.js';
import { escape } from '../utils.js';

// For multi-line quotes (e.g., stanzas in a poem or song), I don't want to have to manually insert <br> in place of newlines. The default markdown parser turns this off in favor of newlines. Making a new parser here to avoid mutating the global one.
const markdown = makeMarkdownParser().set({ breaks: true });

export default function quote(children, sourceName, sourceUrl) {
  if (sourceUrl && !sourceUrl.startsWith('http') && !sourceUrl.startsWith('/')) {
    throw new Error(`Quote citation is not a recognized url: ${sourceUrl}.`);
  }
  if (!sourceName) {
    throw new Error('Quotes must attribute a source.');
  }
  if (!children) {
    throw new Error('Quotes must have non-empty content.');
  }
  const quoteContent = markdown.render(children.trim());
  const citeContent = markdown.renderInline(sourceName);
  const citeInnerHTML = sourceUrl
    ? `<a href="${escape(sourceUrl)}" rel="noreferrer noopener">${citeContent}</a>`
    : citeContent;
  return `<blockquote class="rhythm" cite="${sourceUrl}">
    <div class="rhythm">${quoteContent}</div>
    <footer><cite>${citeInnerHTML}</cite></footer>
  </blockquote>`;
}
