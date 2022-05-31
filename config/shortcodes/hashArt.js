const hashArt = (hash) => {
  const bytes = new Uint8Array(Buffer.from(hash, 'hex'));
  const byteArray = Array.from(bytes).slice(0, bytes.length - 1);

  let result = `<div class="hash-art-grid">`;
  for (let i = 0; i < byteArray.length - 3; i++) {
    const rgb = byteArray.slice(i, i + 3);
    result += `<div class="hash-art-cell" style="background-color: rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})"></div>`;
  }
  result += `</div>`;
  return result;
};

module.exports = hashArt;
