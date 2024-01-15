const { markdown }= require('../plugins/markdown');

/** Renders a blockquote with a <dfn> and a corresponding definition */
const definition = (children, term) => {
  if (!children) {
    throw new Error('You must provide a non-empty definition.');
  }
  if (typeof term !== 'string' || !term) {
    throw new Error('You must provide the name of the term being defined as a string.');
  }
  // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dfn
  const content = markdown.renderInline(`<dfn><strong>${term}</strong></dfn>: ${children.trim()}`);
  return `<p class="definition post-aside rhythm">${content}</p>`;
};

module.exports = definition;
