const slugify = require('slugify');
const { dir } = require('../constants');

/** Returns an array of all blog posts. */
const getAllPosts = (collection) => {
  return collection.getFilteredByGlob(`${dir.input}/_posts/*.md`);
};

/**
 * Returns an array of all unique values from the given collection under the specified key.
 * Credit: https://www.webstoemp.com/blog/basic-custom-taxonomies-with-eleventy/.
 * @param {*} collectionItems - an array of collection items to map to their unique values under a key
 * @param {*} key - the key to look up in the item's data object
 * @returns
 */
const getAllUniqueKeyValues = (collectionItems, key) => {
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
const slugifyString = (str) => {
  return slugify(str, {
    replacement: '-',
    remove: /[#,&,+()$~%.'":*?<>{}]/g,
    lower: true,
  });
};

/** Helper to throw an error if the provided argument is not of the expected. */
const throwIfNotType = (arg, expectedType) => {
  if (typeof arg !== expectedType) {
    throw new Error(`Expected argument of type ${expectedType} but instead got ${arg} (${typeof arg})`);
  }
};

module.exports = {
  getAllPosts,
  getAllUniqueKeyValues,
  slugifyString,
  throwIfNotType,
};
