const Image = require('@11ty/eleventy-img');
const { outdent } = require('outdent');
const { escape } = require('lodash');
const { dir, imagePaths } = require('../constants');
const { stringifyAttributes } = require('../utils');

/**
 * @typedef ImageShortcodeProps
 * @property {string} src An absolute path to the image, relative to the project root (e.g., `src/assets/images/*`).
 * @property {string} [alt] Alt text for the image. Default: `''`.
 * @property {string} [baseFormat] The base (unoptimized) format to output for the image. Default: `'jpeg'`.
 * @property {string[]} [optimizedFormats] The optimized formats to output for the image. Default: `['webp']`.
 * @property {number[]} [widths] The widths to generate for the image. Aspect ratio is preserved. Original image with is always included. Default: `[400, 800]`.
 * @property {string} [sizes] The `sizes` attribute for the image.
 * @property {string} [className] An optional class name for the outer picture tag.
 * @property {string} [imgClass] An optional class name for the `<img>` tag.
 * @property {boolean} [clickable] Whether the image is clickable. If `true`, wraps the picture markup in an anchor that links to the largest resolution image.
 * @property {boolean} [lazy] Whether the image is `loading="lazy"`. Default: `true`.
 */

/**
 * @param {ImageShortcodeProps} props
 */
const imageShortcode = async (props) => {
  const {
    src,
    alt = '',
    baseFormat = 'jpeg',
    optimizedFormats = ['webp'],
    widths = [400, 800], // Default widths for the most common use case (post images)
    sizes = '100vw',
    className,
    imgClass,
    clickable = true,
    lazy = true,
  } = props ?? {};

  const imageOptions = {
    // Always include the original image width in the output
    widths: [null, ...widths],
    // List optimized formats before the base format so that the output contains webp sources before jpegs.
    formats: [...optimizedFormats, baseFormat],
    // Where the generated image files get saved (e.g., _site/assets/images/*)
    outputDir: imagePaths.output,
    // Public URL path that's referenced in the img tag's src attribute (e.g., /assets/images/*)
    urlPath: imagePaths.output.replace(dir.output, ''),
  };
  const imageMetadata = await Image(src, imageOptions);

  // Map each unique format (e.g., jpeg, webp) to its various sizes
  const formatSizes = Object.entries(imageMetadata).reduce((formatSizes, [format, images]) => {
    if (!formatSizes[format]) {
      const largestVariant = images[images.length - 1];
      formatSizes[format] = {
        // Other sizes of interest could go here in the future
        largest: largestVariant,
      };
    }
    return formatSizes;
  }, {});

  const { width, height } = formatSizes[baseFormat].largest;

  const pictureAttributes = stringifyAttributes({
    class: className,
  });

  const imgAttributes = stringifyAttributes({
    width,
    height,
    src: formatSizes[baseFormat].largest.url,
    alt: escape(alt),
    class: imgClass,
    loading: lazy ? 'lazy' : undefined,
    decoding: 'async',
  });

  /** Returns source elements as an HTML string. */
  const sourceHtmlString = Object.values(imageMetadata)
    // Map each format to the source HTML markup
    .map((formatEntries) => {
      // The first entry is representative of all the others since they each have the same shape
      const { sourceType } = formatEntries[0];
      const srcset = formatEntries.map((image) => image.srcset).join(', ');

      const sourceAttributes = stringifyAttributes({
        type: sourceType,
        srcset,
        sizes,
      });

      return `<source ${sourceAttributes}>`;
    })
    .join('\n');

  // Custom image markup
  const picture = `<picture ${pictureAttributes}>
    ${sourceHtmlString}
    <img ${imgAttributes}>
  </picture>`;

  // Link to the highest resolution optimized image
  if (clickable) {
    return outdent`<a class="outline-offset" href="${formatSizes[optimizedFormats[0]].largest.url}">${picture}</a>`;
  }

  // Otherwise just return the plain picture tag
  return outdent`${picture}`;
};

module.exports = imageShortcode;
