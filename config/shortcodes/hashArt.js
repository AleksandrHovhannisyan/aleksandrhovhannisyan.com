const hashArt = (hash) => {
  const bytes = new Uint8Array(Buffer.from(hash, 'hex'));
  let result = `<div class="hash-art-grid" role="img" aria-label="A four-by-four grid of grayscale tiles generated from the hash ${hash}.">`;
  for (let i = 0; i < bytes.length - 4; i++) {
    const [r, g, b] = bytes.slice(i, i + 3);
    result += `<div style="background-color: rgb(${r}, ${g}, ${b})"></div>`;
  }
  result += `</div>`;
  return result;
};

module.exports = hashArt;
