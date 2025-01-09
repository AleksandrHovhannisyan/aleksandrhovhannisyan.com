import { markdown } from '../plugins/markdown.js';

export default function details(children, summary, open = false) {
	if (!children) {
		throw new Error('You must provide a non-empty string for an aside.');
	}
	const content = markdown.render(children);
	return `<details${open ? ' open' : ''}>
  <summary class="outline-offset">${summary}</summary>
  <div class="details-content rhythm">${content}</div>
  </details>`;
}
