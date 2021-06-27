const lodash = require('lodash');
const slugify = require('slugify');
const { postsDirectory } = require('../constants');

/** Returns an array of all blog posts. */
const getAllPosts = (collection) => {
  return collection.getFilteredByGlob(postsDirectory);
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
  values = lodash.flattenDeep(values);
  // Remove duplicates
  values = [...new Set(values)];
  // Sort alphabetically
  values = values.sort((key1, key2) => key1.localeCompare(key2, 'en', { sensitivity: 'base' }));
  // Phew, we're done!
  return values;
};

/** Converts the given string to a slug form. */
const slugifyString = (str) => {
  return slugify(str, {
    replacement: '-',
    remove: /[&,+()$~%.'":*?<>{}]/g,
    lower: true,
  });
};

module.exports = {
  getAllPosts,
  getAllUniqueKeyValues,
  slugifyString,
};
