import nanoid from './nanoid.js';

/**
 * @param {string} hash - A 40-character git hash from which to generate the grayscale art. Example: `7064455f12fcd0632debc20ea5cc333395c2baa5`.
 */
export default function hashArt(hash) {
  // ID to label the SVG title, for accessibility. Generate a new one per invocation to guarantee uniqueness.
  const id = nanoid();
  // Buffer.from(hash, 'hex') will give us an array of 20 bytes; Uint8Array will interpret each byte in decimal
  const bytes = new Uint8Array(Buffer.from(hash, 'hex'));
  // Markup for the grid
  let result = `<svg
        viewBox="0 0 4 4"
        width="100"
        height="100"
        class="hash-art"
        role="img"
        aria-labelledby="${id}"
      >
        <title id="${id}">Four-by-four grayscale grid for the git commit hash ${hash}.</title>`;
  // we want a 4x4=16-tile grid, so exclude the last four bytes
  for (let i = 0; i < bytes.length - 4; i++) {
    const gray = bytes[i];
    const x = i % 4;
    const y = Math.floor(i / 4);
    result += `<rect x="${x}" y="${y}" width="1" height="1" style="fill: rgb(${gray}, ${gray}, ${gray})"></rect>`;
  }
  result += `</svg>`;
  return result;
};

