import path from 'node:path';

export const dir = {
  input: 'src',
  output: '_site',
  includes: '_includes',
  layouts: '_layouts',
  data: '_data',
  assets: 'assets',
};

export const imagePaths = {
  input: path.join(dir.input, dir.assets, 'images'),
  output: path.join(dir.output, dir.assets, 'images'),
};

export const scriptDirs = {
  input: path.join(dir.input, dir.assets, 'scripts'),
  output: path.join(dir.output, dir.assets, 'scripts'),
};
