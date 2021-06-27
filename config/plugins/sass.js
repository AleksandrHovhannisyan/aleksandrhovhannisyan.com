const { sassPaths } = require('../constants');

module.exports = {
  watch: [sassPaths.partials, sassPaths.stylesheets, '!node_modules/**'],
  sourcemaps: true,
  cleanCSS: true,
  autoprefixer: true,
  outputDir: sassPaths.output,
};
