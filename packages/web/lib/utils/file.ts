import path from 'node:path';

export const withoutBaseDirectory = (pathString: string) => {
  // e.g., /a/b/c => ['a', 'b', 'c']
  const parts = pathString.replace(/^\//, '').split(path.sep);
  return path.sep + parts.slice(1).join(path.sep);
};
