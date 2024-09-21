import path from 'node:path';

export const dir = {
  input: 'src',
  output: 'dist',
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

export const FontVariant = {
  REGULAR: 'regular',
  MEDIUM: 'medium',
  BOLD: 'bold',
};

export const FontStyle = {
  NORMAL: 'normal',
  ITALIC: 'italic',
};

export const FontDisplay = {
  SWAP: 'swap',
};
