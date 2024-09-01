import { FontVariant, FontStyle, FontDisplay } from '../../core/fonts/fonts.constants.js';
import { getFontUrl } from '../../core/fonts/fonts.utils.js';

/** Fonts used on the art page.
 * @type {import("../../types/fonts").FontConfig}
 */
export const fonts = {
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
