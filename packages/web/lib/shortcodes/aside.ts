import { markdown } from '../plugins/markdown.ts';

export default function aside(children: string) {
  if (!children) {
    throw new Error('You must provide a non-empty string for the children prop.');
  }
  const content = markdown.render(children);
  return `<aside role="note" class="aside rhythm">${content}</aside>`;
}
