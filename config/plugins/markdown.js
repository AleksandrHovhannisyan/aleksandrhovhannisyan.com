const markdownIt = require('markdown-it');
const markdownItAnchor = require('markdown-it-anchor');
const markdownItKatex = require('@iktakahiro/markdown-it-katex');
const markdownItTocDoneRight = require('markdown-it-toc-done-right');
const markdownItLinkAttributes = require('markdown-it-link-attributes');
const { slugifyString } = require('../utils');

const markdownLib = markdownIt({
  html: true,
  breaks: true,
})
  .use(markdownItAnchor, {
    slugify: slugifyString,
    permalink: markdownItAnchor.permalink.ariaHidden({
      symbol: '#',
      class: 'heading-anchor',
      placement: 'after',
    }),
  })
  .use(markdownItTocDoneRight, {
    placeholder: `{:toc}`, // same as Jekyll
    slugify: slugifyString,
    containerId: 'toc',
    listClass: 'toc-list',
    itemClass: 'toc-item',
    linkClass: 'toc-link underlined-link',
    listType: 'ol',
  })
  .use(markdownItLinkAttributes, {
    // Only external links (explicit protocol; internal links use relative paths)
    pattern: /^https?:/,
    attrs: {
      target: '_blank',
      rel: 'noreferrer noopener',
    },
  })
  .use(markdownItKatex, {
    strict: false,
    throwOnError: true,
  });

module.exports = markdownLib;
