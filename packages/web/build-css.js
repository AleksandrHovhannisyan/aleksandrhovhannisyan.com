import * as sass from 'sass';
import path from 'node:path';
import fs from 'node:fs';
import crypto from 'node:crypto';

const CSS_SOURCE_DIRECTORY = path.resolve(import.meta.dirname, 'src/assets/styles');
const CSS_HASH_OUTPUT_FILE = path.resolve(import.meta.dirname, 'src/_data/assetHashes.json');

/**
 * Returns the absolute paths to all source files matching custom criteria.
 * @param {string} dir
 * @param {(file: import('node:fs').Dirent) => boolean} isMatch
 * @returns string[]
 */
function getFiles(dir, isMatch) {
  let files = [];

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files = files.concat(getFiles(entryPath, isMatch));
    } else if (entry.isFile() && isMatch(entry)) {
      files.push(entryPath);
    }
  }

  return files;
}

function getAssetPath(dir) {
  const root = '/assets/';
  const index = dir.indexOf(root);
  return index !== -1 ? dir.slice(index) : dir;
}

/**
 * @param {string} outputPath The fully resolved (absolute) system path to the output file.
 * @param {string} content The contents to write to `outputPath`.
 * @param {BufferEncoding} encoding The text encoding algorithm to use.
 */
async function writeFileWithHash(outputPath, content, encoding) {
  const hash = crypto.createHash('md5').update(content).digest('hex');
  const { dir, name, ext } = path.parse(outputPath);
  if (!fs.existsSync(dir)) {
    await fs.promises.mkdir(dir, { recursive: true });
  }
  outputPath = path.join(dir, `${name}-${hash}${ext}`);
  await fs.promises.writeFile(outputPath, content, encoding);
  return { outputPath, hash };
}

const assetHashes = {};
const inputSassFiles = getFiles(
  CSS_SOURCE_DIRECTORY,
  (file) => file.name.endsWith('.scss') && !file.name.startsWith('_')
);

await Promise.all(
  inputSassFiles.map(async (inputFile) => {
    const result = await sass.compileAsync(inputFile, { style: 'compressed' });

    // e.g., /home/repo/packages/web/src/assets/styles/main.scss => /assets/styles/main.css
    const href = getAssetPath(inputFile).replace(/\.scss$/i, '.css');
    const { hash, outputPath } = await writeFileWithHash(
      path.resolve(import.meta.dirname, path.join('dist', href)),
      result.css,
      'utf-8'
    );
    assetHashes[href] = hash;
    console.log(`[build:css]: compiled ${inputFile} to ${outputPath}`);
  })
);

// Write hashes to Eleventy _data folder for lookup at build time
fs.writeFileSync(CSS_HASH_OUTPUT_FILE, JSON.stringify(assetHashes));
console.log(`[build:css]: wrote asset hashes to ${CSS_HASH_OUTPUT_FILE}`, assetHashes);
