import Image from '@11ty/eleventy-img';
import escape from 'lodash/escape.js';
import stringifyAttributes from 'stringify-attributes';
import { imagePaths } from '../constants.js';
import { withoutBaseDirectory } from '../utils.js';

/**
 * @typedef ImageShortcodeProps
 * @property {string} src An absolute path to the image, relative to the project root (e.g., `src/assets/images/*`).
 * @property {string} [alt] Alt text for the image. Default: `''`.
 * @property {string} [baseFormat] The base (unoptimized) format to output for the image. Default: `'jpeg'`.
 * @property {string[]} [optimizedFormats] The optimized formats to output for the image. Default: `['webp']`.
 * @property {number[]} [widths] The widths to generate for the image. Aspect ratio is preserved. Original image with is always included. Default: `[400, 800]`.
 * @property {string} [sizes] The `sizes` attribute for the image.
 * @property {string} [className] An optional class name for the outer picture tag.
 * @property {string} [imgClassName] An optional class name for the `<img>` tag.
 * @property {boolean} [isLazy] Whether the image is `loading="lazy"`. Default: `true`.
 */

/**
 * @param {ImageShortcodeProps} props
 */
export default async function imageShortcode(props) {
  const {
    src,
    alt = '',
    baseFormat = 'jpeg',
    optimizedFormats = ['webp'],
    widths = [400, 800], // Default widths for the most common use case (post images)
    sizes = '100vw',
    className,
    imgClassName,
    isLazy = true,
  } = props ?? {};

  const imageOptions = {
    // Always include the original image width in the output
    widths: [null, ...widths],
    // List optimized formats before the base format so that the output contains webp sources before jpegs.
    formats: [...optimizedFormats, baseFormat],
    // Where the generated image files get saved (e.g., _site/assets/images/*)
    outputDir: imagePaths.output,
    // Public URL path that's referenced in the img tag's src attribute (e.g., /assets/images/*)
    urlPath: withoutBaseDirectory(imagePaths.output),
  };
  const imageMetadata = await Image(src, imageOptions);

  const getLargestImage = (format) => {
    const images = imageMetadata[format];
    return images[images.length - 1];
  };

  const largestImages = {
    base: getLargestImage(baseFormat),
    optimized: getLargestImage(optimizedFormats[0]),
  };

  const { width, height } = largestImages.base;

  const pictureAttributes = stringifyAttributes({
    class: className,
  });

  const imgAttributes = stringifyAttributes({
    width,
    height,
    src: largestImages.base.url,
    alt: escape(alt),
    class: imgClassName,
    loading: isLazy ? 'lazy' : undefined,
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
  return `<picture ${pictureAttributes}>
    ${sourceHtmlString}
    <img ${imgAttributes}>
  </picture>`;
}
