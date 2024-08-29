import markdownIt from 'markdown-it';
import markdownItAttrs from 'markdown-it-attrs';
import markdownItAnchor from 'markdown-it-anchor';
import markdownItKatex from '@iktakahiro/markdown-it-katex';
import markdownItClass from '@toycode/markdown-it-class';
import markdownItTocDoneRight from 'markdown-it-toc-done-right';
import markdownItLinkAttributes from 'markdown-it-link-attributes';
import markdownItCodeTabIndex from 'markdown-it-code-tabindex';
import { slugifyString } from '../utils.js';
import { makeFencedCodeRenderer, makeSyntaxHighlighter } from './highlight.js';

/** Configures and returns a markdown parser. */
export const makeMarkdownParser = () => {
  const markdownParser = markdownIt({
    // Use of HTML tags in Markdown
    html: true,
    // Conversion of \n to <br>
    breaks: false,
    // Automatically hyperlinking inline links
    linkify: true,
    // Smart quotes and other symbol replacements
    typographer: true,
  })
    // https://github.com/11ty/eleventy/issues/2438
    .disable('code')
    .use(markdownItAttrs)
    .use(markdownItCodeTabIndex, { target: 'code' })
    .use(markdownItTocDoneRight, {
      placeholder: `{:toc}`, // same as Jekyll
      slugify: slugifyString,
      containerId: 'toc',
      listClass: 'toc-list',
      itemClass: 'toc-item',
      linkClass: 'toc-link',
      listType: 'ol',
    })
    .use(markdownItClass, {
      blockquote: 'rhythm',
    })
    .use(markdownItAnchor, {
      slugify: slugifyString,
      tabIndex: false,
      permalink: markdownItAnchor.permalink.headerLink({
        class: 'to-underline',
      }),
    })
    .use(markdownItLinkAttributes, {
      // Only external links (explicit protocol; internal links use relative paths)
      pattern: /^https?:/,
      attrs: {
        rel: 'noopener',
      },
    })
    .use(markdownItKatex, {
      strict: false,
      throwOnError: true,
    });
  markdownParser.options.highlight = makeSyntaxHighlighter(markdownParser);
  markdownParser.renderer.rules.fence = makeFencedCodeRenderer(markdownParser);
  return markdownParser;
};

/** A customized, default markdown parser. Suitable for most of my parsing needs. */
export const markdown = makeMarkdownParser();
