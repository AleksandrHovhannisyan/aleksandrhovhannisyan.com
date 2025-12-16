import { markdown } from '../plugins/markdown.ts';

export default function details(children: string, summary: string, open = false) {
  if (!children) {
    throw new Error('You must provide a non-empty string for the children prop.');
  }
  const content = markdown.render(children);
  return `<details${open ? ' open' : ''}>
  <summary>${summary}</summary>
  <div class="details-content rhythm">${content}</div>
  </details>`;
}
