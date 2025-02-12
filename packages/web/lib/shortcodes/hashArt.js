import nanoid from './nanoid.js';

// 12*12 = 144, largest perfect square we can get from a 160-bit git hash
const SIZE = 12;

/**
 * @param {string} hash - A 40-character git hash from which to generate the grayscale art. Example: `7064455f12fcd0632debc20ea5cc333395c2baa5`.
 */
export default function hashArt(hash) {
  // ID to label the SVG title, for accessibility. Generate a new one per invocation to guarantee uniqueness.
  const id = nanoid();

  // Markup for the grid
  let result = `<svg
        viewBox="0 0 ${SIZE} ${SIZE}"
        width="60"
        height="60"
        class="hash-art"
        role="img"
        aria-labelledby="${id}"
      >
        <title id="${id}">${hash}</title>`;

  // Note: Each git hash is 20 bytes long (160 bits)
  const bytes = new Uint8Array(Buffer.from(hash, 'hex'));
  // Read git hash as an array of bytes. Stop at 18*8 = 144 bits because it's the largest perfect square < 160.
  for (let i = 0; i < 18; i++) {
    const byte = bytes[i];
    // Parse byte one bit at a time, in Big Endian order (LTR)
    for (let j = 7; j >= 0; j--) {
      // e.g., 10011010 => [1, 0, 0, 1, 1, 0, 1, 0]
      const bit = (byte >> j) & 0b00000001;
      const bitIndex = i * 8 + (7 - j);
      const x = bitIndex % SIZE;
      const y = Math.floor(bitIndex / SIZE);
      result += `<rect x="${x}" y="${y}" width="1" height="1" data-value="${bit}"></rect>`;
    }
  }
  result += `</svg>`;
  return result;
}
