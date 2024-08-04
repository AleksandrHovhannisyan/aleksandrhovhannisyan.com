import path from 'path';

/** Helper to auto-prefix a font src url with the path to local fonts. */
export const getFontUrl = (src) => path.join(`/assets/fonts`, src);
