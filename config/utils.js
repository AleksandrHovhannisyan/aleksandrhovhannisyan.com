import childProcess from 'child_process';
import sanitize from 'sanitize-html';
import slugify from 'slugify';
import path from 'path';

/**
 * Returns an array of all unique values from the given collection under the specified key.
 * Credit: https://www.webstoemp.com/blog/basic-custom-taxonomies-with-eleventy/.
 * @param {*} collectionItems - an array of collection items to map to their unique values under a key
 * @param {*} key - the key to look up in the item's data object
 * @returns
 */
export const getAllUniqueKeyValues = (collectionItems, key) => {
  // First map each collection item (e.g., blog post) to the value it holds under key.
  let values = collectionItems.map((item) => item.data[key] ?? []);
  // Recursively flatten it to a 1D array
  values = values.flat();
  // Remove duplicates
  values = [...new Set(values)];
  // Sort alphabetically
  values = values.sort((key1, key2) => key1.localeCompare(key2, 'en', { sensitivity: 'base' }));
  return values;
};

/** Converts the given string to a slug form. */
export const slugifyString = (str) => {
  return slugify(str, {
    replacement: '-',
    remove: /[#,&,+()$~%.'":*?<>{}]/g,
    lower: true,
  });
};

/** Helper to throw an error if the provided argument is not of the expected. */
export const throwIfNotType = (arg, expectedType) => {
  if (typeof arg !== expectedType) {
    throw new Error(`Expected argument of type ${expectedType} but instead got ${arg} (${typeof arg})`);
  }
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
 * Credit: https://stackoverflow.com/a/34518749/5323344
 * @param {'short'|'long'} format
 */
export const getLatestGitCommitHash = (format = 'long') => {
  return childProcess
    .execSync(`git rev-parse ${format === 'short' ? '--short' : ''} HEAD`)
    .toString()
    .trim();
};

/**
 * @param {string} pathString
 */
export const withoutBaseDirectory = (pathString) => pathString.substring(pathString.indexOf(path.sep));
