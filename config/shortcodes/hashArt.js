/**
 * @param {string} hash - A 40-character git hash from which to generate the grayscale art. Example: `7064455f12fcd0632debc20ea5cc333395c2baa5`.
 */
const hashArt = (hash) => {
  // Buffer.from(hash, 'hex') will give us an array of 20 bytes; Uint8Array will interpret each byte in decimal
  const bytes = new Uint8Array(Buffer.from(hash, 'hex'));
  // Markup for the artwork
  let result = `<div class="hash-art-grid" role="img" aria-label="A four-by-four grid of grayscale tiles generated from the hash ${hash}.">`;
  // we want a 4x4=16-tile grid, so exclude the last four bytes
  for (let i = 0; i < bytes.length - 4; i++) {
    const gray = bytes[i];
    result += `<div style="background-color: rgb(${gray}, ${gray}, ${gray})"></div>`;
  }
  result += `</div>`;
  return result;
};

module.exports = hashArt;
