import path from 'node:path';

/**
 * @param {string} pathString
 */
export const withoutBaseDirectory = (pathString) => {
  // e.g., /a/b/c => ['a', 'b', 'c']
  const parts = pathString.replace(/^\//, '').split(path.sep);
  return path.sep + parts.slice(1).join(path.sep);
};
