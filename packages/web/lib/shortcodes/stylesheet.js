import fs from 'node:fs';
import path from 'node:path';

/** Returns a `<link rel="stylesheet">` tag for the given `href`.
 * In production, it appends hashes to hrefs. See build-css.js.
 * @param {string} href The source-relative path to the stylesheet, e.g. /assets/styles/main.css
 */
export default function stylesheet(href) {
  // Ignore hashing in dev and for remote URLs
  if (process.env.ELEVENTY_ENV === 'development' || href.startsWith('http')) {
    return `<link rel="stylesheet" href="${href}">`;
  }

  const hash = this.ctx.environments.assetHashes[href];
  // This should never happen, but best to throw an error so we don't fail silently and interpolate "-undefined"
  if (!hash) {
    throw new Error(`No asset hash for requested stylesheet: ${href}`);
  }

  // Append hash to file name
  const { dir, name, ext } = path.parse(href);
  const hashedFilePath = path.join(dir, `${name}-${hash}${ext}`);

  // This should also never happen, but best to validate
  if (!fs.existsSync(path.join(this.eleventy.directories.output, hashedFilePath))) {
    throw new Error(`Stylesheet not found: ${hashedFilePath}.`);
  }

  return `<link rel="stylesheet" href="${hashedFilePath}">`;
}
