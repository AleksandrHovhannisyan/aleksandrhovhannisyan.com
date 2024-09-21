import path from 'node:path';
import { toAbsoluteImageUrl } from '../../../lib/filters.js';
import { dir } from '../../../lib/constants.js';
import { FontVariant, FontStyle, FontDisplay } from '../../../lib/constants.js';
import { getFontUrl } from '../../../lib/utils.js';

/** Fonts used on the art page.
 * @type {import("../../../lib/types/fonts").FontConfig}
 */
const fonts = {
  cursive: {
    type: 'static',
    family: 'Reenie Beanie',
    fallbacks: [`cursive`],
    variants: {
      [FontVariant.REGULAR]: {
        roman: {
          weight: 400,
          style: FontStyle.NORMAL,
          url: getFontUrl('reeniebeanie-latin-400-roman.woff2'),
          postscriptName: `ReenieBeanie-Regular`,
          display: FontDisplay.SWAP,
        },
      },
    },
  },
  display: {
    type: 'static',
    family: 'Rampart One',
    fallbacks: [`Sans-fallback`],
    variants: {
      [FontVariant.REGULAR]: {
        roman: {
          weight: 400,
          style: FontStyle.NORMAL,
          url: getFontUrl('rampartone-latin-400-roman.woff2'),
          postscriptName: `RampartOne-Regular`,
          display: FontDisplay.SWAP,
        },
      },
    },
  },
};

export default {
  fonts,
  eleventyComputed: {
    openGraph: {
      twitter: {
        card: 'summary_large_image',
      },
      image: (data) => {
        return toAbsoluteImageUrl({
          src: 'src/_pages/art/og-art.png',
          outputDir: path.join(dir.output, data.page.url),
        });
      },
    },
  },
};
