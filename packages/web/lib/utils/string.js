import sanitize from 'sanitize-html';
import slugify from 'slugify';

/** Converts the given string to a slug form. */
export const slugifyString = (str) => {
  return slugify(str, {
    replacement: '-',
    remove: /[#,&,+()$~%.'":*?<>{}]/g,
    lower: true,
  });
};

/** Sanitizes an HTML string.
 * @param {string} html The HTML string to sanitize.
 * @returns {string}
 */
export const sanitizeHtml = (html) => {
  return sanitize(html, {
    // allow images
    allowedTags: sanitize.defaults.allowedTags.concat(['img']),
    allowedAttributes: {
      ...sanitize.defaults.allowedAttributes,
      // Class for syntax highlighting
      pre: ['class'],
      figure: ['class', 'data-language'],
      // Class for syntax highlighting; tabindex added by https://github.com/AleksandrHovhannisyan/markdown-it-code-tabindex
      code: ['class', 'tabindex'],
      // Prism outputs spans with class names for tokens
      span: ['class'],
      // Quotes
      blockquote: ['class'],
      // Code file names
      figcaption: ['class'],
    },
  });
};

/**
 * @param {Map<string, string>} keyMap
 * @returns {(str: string) => string}
 */
function makeStringEscaper(keyMap) {
  const replacementRegex = new RegExp(`[${Array.from(keyMap.keys()).join('')}]`, 'g');
  /**
   * @param {string} string
   */
  return function escape(string) {
    return string.replace(replacementRegex, (char) => keyMap.get(char));
  };
}

/** Escapes reserved characters as HTML entities. */
export const escape = makeStringEscaper(
  new Map([
    ['&', '&amp;'],
    ['<', '&lt;'],
    ['>', '&gt;'],
    ['"', '&quot;'],
    ["'", '&#39;'],
  ])
);
