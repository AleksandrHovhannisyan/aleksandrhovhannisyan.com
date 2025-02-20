import { markdown } from '../plugins/markdown.js';

export default function aside(children) {
  if (!children) {
    throw new Error('You must provide a non-empty string for the children prop.');
  }
  const content = markdown.render(children);
  return `<aside role="note" class="aside rhythm">${content}</aside>`;
}
