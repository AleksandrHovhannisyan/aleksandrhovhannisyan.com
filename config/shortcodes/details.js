const markdownLib = require('../plugins/markdown');

const details = (children, summary, open = false) => {
  if (!children) {
    throw new Error('You must provide a non-empty string for an aside.');
  }
  const content = markdownLib.render(children);
  return `<details${open ? ' open' : ''}>
  <summary class="outline-offset">${summary}</summary>
  <div class="details-content rhythm">${content}</div>
  </details>`;
};

module.exports = details;
