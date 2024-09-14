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
]);

/** @param {string|undefined} lang */
const getLanguage = (lang) => LANGUAGE_ALIASES.get(lang) ?? (lang || DEFAULT_LANGUAGE_IF_UNSPECIFIED);

/**
 * Code modified from markdown-it-prism source (MIT, copyright Joshua Gleitze): https://github.com/jGleitz/markdown-it-prism/blob/8c9d7202a840050ca8cf3a3d1ab2cf9ea65c68e5/src/index.ts#L201-L221
 * @param {import("markdown-it")} markdownIt
 */
export function makeFencedCodeRenderer(markdownIt) {
  const defaultRenderer = markdownIt.renderer.rules.fence;
  /** @type {import('markdown-it/lib/renderer.mjs').RenderRule} */
  return (tokens, idx, options, env, self) => {
    const fencedCodeBlockToken = tokens[idx];
    const info = fencedCodeBlockToken.info ? markdownIt.utils.unescapeAll(fencedCodeBlockToken.info).trim() : '';
    const language = getLanguage(info.split(/(\s+)/g)[0]);
    fencedCodeBlockToken.info = language;
    const defaultRenderedCodeBlock = defaultRenderer(tokens, idx, options, env, self);
    const languageClassName = markdownIt.options.langPrefix + language;

    // Patch class names to include Prism language class
    let codeBlockHtml = defaultRenderedCodeBlock.replace(
      /<((?:pre|code)[^>]*?)(?:\s+class="([^"]*)"([^>]*))?>/g,
      (match, tagStart, classNames, tagEnd) => {
        // already has class name, just return existing match
        return classNames?.includes(languageClassName)
          ? match
          : // class names don't include lang class, so add it after existing classes
            `<${tagStart} class="${classNames ? `${classNames} ` : ''}${languageClassName}"${tagEnd || ''}>`;
      }
    );

    // Copyable code blocks get data-copyable="true" via markdown-it-attrs
    let copyCodeMatch = /<code[^>]*\b(?<attribute>data-copyable="true")/.exec(codeBlockHtml);
    let hasCopyCodeButton = !!copyCodeMatch && copyCodeMatch.groups?.attribute;

    // Code blocks with file names get data-file="filename" via markdown-it-attrs
    const fileNameMatch = /<code[^>]*\b(?<attribute>data-file="(?<fileName>[^"]*)")/.exec(codeBlockHtml);
    let hasFileName = !!fileNameMatch && fileNameMatch.groups?.attribute && fileNameMatch.groups?.fileName;

    // Code block that needs additional markup
    if (hasCopyCodeButton || hasFileName) {
      let captionHtml = '';
      let copyCodeHtml = '';

      if (hasCopyCodeButton) {
        copyCodeHtml =
          '<button class="copy-code-button" aria-label="Copy code to clipboard">Copy</button><span role="alert" class="screen-reader-only"></span>';
        // Don't need the data-copyable="true" attribute anymore
        codeBlockHtml = codeBlockHtml.replace(copyCodeMatch.groups?.attribute, '');
      }
      if (hasFileName) {
        captionHtml = `<figcaption>${fileNameMatch.groups?.fileName}</figcaption>`;
        // We don't need the data-file=".*" attribute anymore
        codeBlockHtml = codeBlockHtml.replace(fileNameMatch.groups?.attribute, '');
      }
      codeBlockHtml = `${captionHtml}${codeBlockHtml}${copyCodeHtml}`;
    }

    return `<figure class="code-block">${codeBlockHtml}</figure>`;
  };
}

/**
 * @param {import("markdown-it")} markdownIt
 * @returns
 */
export function makeSyntaxHighlighter(markdownIt) {
  /**
   * @param {string} code The fenced code block contents.
   * @param {string} lang The fenced code block language.
   * @returns {string}
   */
  return (code, lang) => {
    try {
      const language = getLanguage(lang);
      // Load new language dynamically, as needed
      if (language !== DEFAULT_LANGUAGE_IF_UNSPECIFIED && !Object.hasOwn(Prism.languages, language)) {
        console.log(`Loading language ${language} for Prism.js syntax highlighter.`);
        loadLanguages([language]);
      }
      return Prism.highlight(code, Prism.languages[language], language);
    } catch (e) {
      console.log(e);
      return markdownIt.utils.escapeHtml(code);
    }
  };
}
