import path from 'node:path';
import Image from '@11ty/eleventy-img';
import stringifyAttributes from 'stringify-attributes';
import { memoize } from '../utils.js';

const FAVICON_FORMAT = 'png';
const APPLE_TOUCH_ICON_WIDTH = 180;
const FAVICON_URL_PATH = '/assets/images/favicons';

async function faviconShortcode(src) {
  const props = {
    widths: [16, 32, 57, 76, 96, 128, APPLE_TOUCH_ICON_WIDTH, 192, 228],
    formats: [FAVICON_FORMAT],
    outputDir: path.join(this.eleventy.directories.output, FAVICON_URL_PATH),
    urlPath: FAVICON_URL_PATH,
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
}

export default memoize(faviconShortcode);
