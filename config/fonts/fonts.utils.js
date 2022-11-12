const path = require('path');

/** Helper to auto-prefix a font src url with the path to local fonts. */
const getFontUrl = (src) => path.join(`/assets/fonts`, src);

module.exports = { getFontUrl };
