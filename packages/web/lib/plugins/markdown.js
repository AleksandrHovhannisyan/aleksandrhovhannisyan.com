import { slugifyString } from '../utils.js';
import iconShortcode from '../shortcodes/icon.js';
import markdownIt from 'markdown-it';
import markdownItAttrs from 'markdown-it-attrs';
import markdownItAnchor from 'markdown-it-anchor';
import markdownItKatex from '@iktakahiro/markdown-it-katex';
import markdownItClass from '@toycode/markdown-it-class';
import markdownItTocDoneRight from 'markdown-it-toc-done-right';
import markdownItLinkAttributes from 'markdown-it-link-attributes';
import markdownItCodeTabIndex from 'markdown-it-code-tabindex';
import Prism from 'prismjs';
import loadLanguages from 'prismjs/components/index.js';
// These imports are needed in bundled environments. I reuse my markdown parser server side in a serverless function to parse user comments, and while it works fine in Netlify, it breaks in Cloudflare Workers (which I'm trying to migrate to) because those are bundled with esbuild/wepack (https://github.com/jGleitz/markdown-it-prism/issues/28). Note that load order matters for some languages (unfortunately... not the best API).
import 'prismjs/components/prism-markup-templating.js';
import 'prismjs/components/prism-markdown.js';
import 'prismjs/components/prism-liquid.js';
import 'prismjs/components/prism-css.js';
import 'prismjs/components/prism-sass.js';
import 'prismjs/components/prism-scss.js';
import 'prismjs/components/prism-javascript.js';
import 'prismjs/components/prism-typescript.js';
import 'prismjs/components/prism-jsx.js';
import 'prismjs/components/prism-tsx.js';
import 'prismjs/components/prism-c.js';
import 'prismjs/components/prism-cpp.js';
import 'prismjs/components/prism-csharp.js';
import 'prismjs/components/prism-yaml.js';
import 'prismjs/components/prism-json.js';
import 'prismjs/components/prism-bash.js';
import 'prismjs/components/prism-lua.js';
import 'prismjs/components/prism-python.js';
import 'prismjs/components/prism-ruby.js';
import 'prismjs/components/prism-toml.js';

const DEFAULT_LANGUAGE_IF_UNSPECIFIED = 'plaintext';

const LANGUAGE_ALIASES = new Map([
  ['js', 'javascript'],
  ['ts', 'typescript'],
  ['md', 'markdown'],
  ['c++', 'cpp'],
  ['c#', 'csharp'],
  ['py', 'python'],
  ['rb', 'ruby'],
  ['yml', 'yaml'],
  ['tml', 'toml'],
  ['njk', 'liquid'], // https://github.com/PrismJS/prism/issues/1124
  ['nunjucks', 'liquid'], // https://github.com/PrismJS/prism/issues/1124
  ['svelte', 'html'],
  ['bat', 'batch'],
]);

/** @param {string|undefined} lang */
function getLanguage(lang) {
  if (LANGUAGE_ALIASES.has(lang)) {
    return LANGUAGE_ALIASES.get(lang);
  }
  return lang || DEFAULT_LANGUAGE_IF_UNSPECIFIED;
}

/**
 * @param {import("markdown-it")} markdownIt
 * @param {boolean} [isTrustedInput] Whether the incoming source Markdown is safe/trusted. Defaults to `true` for my content. Set this to `false` for content from external sources (like user-submitted comments).
 */
function makeFencedCodeRenderer(markdownIt, isTrustedInput) {
  const defaultRenderer = markdownIt.renderer.rules.fence;

  /** @type {import('markdown-it/lib/renderer.mjs').RenderRule} */
  return (tokens, index, options, env, self) => {
    const fencedCodeBlockToken = tokens[index];
    const language = getLanguage(fencedCodeBlockToken.info);
    let codeBlockHtml = defaultRenderer(tokens, index, options, env, self);
    let captionHtml = `<figcaption class="screen-reader-only">${language} code snippet</figcaption>`;
    let copyCodeButtonHtml = '';

    if (isTrustedInput) {
      // Copyable code blocks get data-copyable="true" via markdown-it-attrs
      let copyCodeMatch = /<code[^>]*\b(?<attribute>data-copyable="?true"?)/.exec(codeBlockHtml);
      let hasCopyCodeButton = !!copyCodeMatch && copyCodeMatch.groups?.attribute;

      // Code blocks with file names get data-file="filename" via markdown-it-attrs
      const fileNameMatch = /<code[^>]*\b(?<attribute>data-file="?(?<fileName>[^"]*)"?)/.exec(codeBlockHtml);
      let hasFileName = !!fileNameMatch && fileNameMatch.groups?.attribute && fileNameMatch.groups?.fileName;

      if (hasCopyCodeButton) {
        copyCodeButtonHtml = `<button class="copy-code-button" aria-label="Copy code to clipboard">
            Copy
          </button><span role="alert" class="screen-reader-only"></span>`;
        // Don't need the data-copyable="true" attribute anymore
        codeBlockHtml = codeBlockHtml.replace(copyCodeMatch.groups?.attribute, '');
      }
      if (hasFileName) {
        captionHtml = `<figcaption class="file-name">
          ${iconShortcode({ icon: 'file-text', size: 16 })} ${fileNameMatch.groups?.fileName}
        </figcaption>`;
        // We don't need the data-file=".*" attribute anymore
        codeBlockHtml = codeBlockHtml.replace(fileNameMatch.groups?.attribute, '');
      }
    }

    codeBlockHtml = `${captionHtml}${codeBlockHtml}${copyCodeButtonHtml}`;
    return `<figure class="code-block" data-language="${language}">${codeBlockHtml}</figure>`;
  };
}

/**
 * @param {import("markdown-it")} markdownIt
 * @param {boolean} [isTrustedInput] Whether the incoming source Markdown is safe/trusted. Defaults to `true` for my content. Set this to `false` for content from external sources (like user-submitted comments).
 * @returns
 */
function makeSyntaxHighlighter(markdownIt, isTrustedInput) {
  /**
   * @param {string} code The plaintext code to highlight.
   * @param {string} lang The language in which the code was written.
   * @returns {string}
   */
  return (code, lang) => {
    let html;
    try {
      const language = getLanguage(lang);
      // Load new language dynamically, as needed
      if (language !== DEFAULT_LANGUAGE_IF_UNSPECIFIED && !Object.hasOwn(Prism.languages, language)) {
        console.log(`Loading language ${language} for Prism.js syntax highlighter.`);
        loadLanguages([language]);
      }
      html = Prism.highlight(code, Prism.languages[language], language);
    } catch (e) {
      console.log(e);
      html = markdownIt.utils.escapeHtml(code);
    }
    return isTrustedInput
      ? html
          .trim()
          .split('\n')
          .map((line) => `<span class="line">${line}</span>`)
          .join('\n')
      : html;
  };
}

/**
 * @typedef MakeMarkdownParserOptions
 * @property {boolean} [isTrustedInput] Whether the incoming source Markdown is safe/trusted. Defaults to `true` for my content. Set this to `false` for content from external sources (like user-submitted comments).
 */

/** Configures and returns a markdown parser.
 * @param {MakeMarkdownParserOptions} [options]
 */
export function makeMarkdownParser(options) {
  const { isTrustedInput } = options ?? {
    isTrustedInput: true,
  };
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
    .use(markdownItCodeTabIndex, { target: 'pre' })
    .use(markdownItTocDoneRight, {
      placeholder: `{:toc}`, // same as Jekyll
      slugify: slugifyString,
      containerId: 'toc',
      listClass: 'toc-list',
      itemClass: 'toc-item',
      linkClass: 'toc-link',
      listType: 'ol',
      level: [1, 2, 3],
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
      trust: isTrustedInput,
      throwOnError: true,
    });
  markdownParser.options.highlight = makeSyntaxHighlighter(markdownParser, isTrustedInput);
  markdownParser.renderer.rules.fence = makeFencedCodeRenderer(markdownParser, isTrustedInput);
  return markdownParser;
}

/** A customized, default markdown parser. Suitable for most of my parsing needs. */
export const markdown = makeMarkdownParser();
