const markdownIt = require('markdown-it');
const markdownItPrism = require('markdown-it-prism');
const markdownItAttrs = require('markdown-it-attrs');
const markdownItAnchor = require('markdown-it-anchor');
const markdownItKatex = require('@iktakahiro/markdown-it-katex');
const markdownItClass = require('@toycode/markdown-it-class');
const markdownItTocDoneRight = require('markdown-it-toc-done-right');
const markdownItLinkAttributes = require('markdown-it-link-attributes');
const markdownItCodeTabIndex = require('markdown-it-code-tabindex');
const { slugifyString } = require('../utils');

/** Configures and returns a markdown parser. */
const makeMarkdownParser = () =>
  markdownIt({
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
    .use(markdownItPrism, {
      defaultLanguage: 'plaintext',
    })
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

/** A customized, default markdown parser. Suitable for most of my parsing needs. */
const markdown = makeMarkdownParser();

module.exports = {
  markdown,
  makeMarkdownParser,
};
