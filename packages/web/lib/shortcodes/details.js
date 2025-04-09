import { markdown } from '../plugins/markdown.js';

export default function details(children, summary, open = false) {
  if (!children) {
    throw new Error('You must provide a non-empty string for the children prop.');
  }
  const content = markdown.render(children);
  return `<details${open ? ' open' : ''}>
  <summary>${summary}</summary>
  <div class="details-content rhythm">${content}</div>
  </details>`;
}
