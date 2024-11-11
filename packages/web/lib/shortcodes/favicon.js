import path from 'node:path';
import Image from '@11ty/eleventy-img';
import stringifyAttributes from 'stringify-attributes';
import { memoize, withoutBaseDirectory } from '../utils.js';
import { imagePaths } from '../constants.js';

const FAVICON_FORMAT = 'png';
const APPLE_TOUCH_ICON_WIDTH = 180;

const faviconShortcode = memoize(async (src) => {
  const props = {
    widths: [16, 32, 57, 76, 96, 128, APPLE_TOUCH_ICON_WIDTH, 192, 228],
    formats: [FAVICON_FORMAT],
    outputDir: path.join(imagePaths.output, 'favicons'),
    urlPath: path.join(withoutBaseDirectory(imagePaths.output), 'favicons'),
    filenameFormat: (_hash, _src, width, format) => {
      return `favicon-${width}.${format}`;
    },
  };

  const metadata = await Image(src, props);
  const faviconHTML = metadata[FAVICON_FORMAT].map((image) => {
    const isAppleTouchIcon = image.width === APPLE_TOUCH_ICON_WIDTH;
    const attributes = stringifyAttributes({
      href: image.url,
      rel: isAppleTouchIcon ? 'apple-touch-icon' : 'icon',
      ...(isAppleTouchIcon ? {} : { sizes: `${image.width}x${image.width}` }),
    });
    return `<link ${attributes}>`;
  }).join('\n');
  return faviconHTML;
});

export default faviconShortcode;
