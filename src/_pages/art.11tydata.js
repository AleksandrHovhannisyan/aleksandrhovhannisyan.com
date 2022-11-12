const { FontVariant, FontStyle, FontDisplay } = require('../../config/fonts/fonts.constants');
const { getFontUrl } = require('../../config/fonts/fonts.utils');

/** Fonts used on the art page.
 * @type {import("../../config/fonts/fonts.typedefs").FontConfig}
 */
const fonts = {
  cursive: {
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

module.exports = { fonts };
