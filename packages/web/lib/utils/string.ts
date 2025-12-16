import sanitize from 'sanitize-html';
import slugify from 'slugify';

/** Converts the given string to a slug form. */
export const slugifyString = (str: string) => {
  return slugify(str, {
    replacement: '-',
    remove: /[#,&,+()$~%.'":*?<>{}]/g,
    lower: true,
  });
};

/** Sanitizes an HTML string. */
export const sanitizeHtml = (html: string): string => {
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

function makeStringEscaper(keyMap: Map<string, string>): (str: string) => string {
  const replacementRegex = new RegExp(`[${Array.from(keyMap.keys()).join('')}]`, 'g');
  return function escape(string: string) {
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
