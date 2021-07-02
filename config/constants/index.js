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

const sassPaths = {
  partials: `${dir.input}/_sass/**/*.scss`,
  stylesheets: `${dir.input}/${dir.assets}/styles/**/*.scss`,
  output: `${dir.output}/${dir.assets}/styles`,
};

module.exports = {
  dir,
  imagePaths,
  sassPaths,
};
