const dir = {
  input: 'src',
  output: '_site',
  includes: '_includes',
  layouts: '_layouts',
  data: '_data',
  assets: 'assets',
};

const imagePaths = {
  source: `${dir.input}/${dir.assets}/images`,
  output: `${dir.output}/${dir.assets}/images`,
};

module.exports = {
  dir,
  imagePaths,
};
