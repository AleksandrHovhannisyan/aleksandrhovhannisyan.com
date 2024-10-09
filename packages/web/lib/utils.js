import sanitize from 'sanitize-html';
import slugify from 'slugify';
import path from 'node:path';

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
      figure: ['class'],
      // Class for syntax highlighting; tabindex added by https://github.com/AleksandrHovhannisyan/markdown-it-code-tabindex
      code: ['class', 'tabindex'],
      // Prism outputs spans with class names for tokens
      span: ['class'],
      // Quotes
      blockquote: ['class'],
    },
  });
};

/**
 * @param {string} pathString
 */
export const withoutBaseDirectory = (pathString) => pathString.substring(pathString.indexOf(path.sep));

/**
 * Memoizes any function.
 * @param {() => Promise<any>} fn
 */
export const memoize = (fn) => {
  const cache = new Map();

  return async (...args) => {
    const key = JSON.stringify(args);
    if (cache.get(key)) {
      return cache.get(key);
    }
    const value = await fn.apply(this, args);
    cache.set(key, value);
    return value;
  };
};
