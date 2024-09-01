import { markdown } from '../plugins/markdown.js';

export default function aside(children) {
  if (!children) {
    throw new Error('You must provide a non-empty string for an aside.');
  }
  const content = markdown.render(children);
  return `<aside role="note" class="post-aside rhythm">${content}</aside>`;
}
