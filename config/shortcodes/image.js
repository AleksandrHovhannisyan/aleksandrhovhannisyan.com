const Image = require('@11ty/eleventy-img');
const { outdent } = require('outdent');
const path = require('path');
const { escape } = require('lodash');
const { dir } = require('../constants');
const { stringifyAttributes, parseImage } = require('../utils');

const ImageWidths = {
  /** The original (source) image width. */
  ORIGINAL: null,
};

const imageShortcode = async (props) => {
  const {
    src,
    alt = '',
    baseFormat = 'jpeg',
    optimizedFormats = ['webp'],
    widths = [400, 800],
    sizes = '100vw',
    className,
    imgClass,
    clickable = true,
    lazy = true,
    shouldReturnUrl = false,
  } = props ?? {};

  const image = parseImage(src);

  const imageOptions = {
    // Templates shouldn't have to worry about passing in `null` and the placeholder width
    widths: [ImageWidths.ORIGINAL, ...widths],
    // List optimized formats before the base format so that the output contains webp sources before jpegs.
    formats: [...optimizedFormats, baseFormat],
    // Where the generated image files get saved
    outputDir: path.join(dir.output, image.dir),
    // Public URL path that's referenced in the img tag's src attribute
    urlPath: image.dir,
  };
  const imageMetadata = await Image(image.src, imageOptions);

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

  if (shouldReturnUrl) {
    return formatSizes[baseFormat].largest.url;
  }

  const { width, height } = formatSizes[baseFormat].largest;

  const pictureAttributes = stringifyAttributes({
    ...(className ? { class: className } : {}),
  });

  const imgAttributes = stringifyAttributes({
    width,
    height,
    src: formatSizes[baseFormat].largest.url,
    alt: escape(alt),
    ...(imgClass ? { class: imgClass } : {}),
    ...(lazy ? { loading: 'lazy' } : {}),
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
    return outdent`<a class="outline-offset block" href="${
      formatSizes[optimizedFormats[0]].largest.url
    }">${picture}</a>`;
  }

  // Otherwise just return the plain picture tag
  return outdent`${picture}`;
};

module.exports = imageShortcode;
