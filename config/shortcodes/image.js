const Image = require('@11ty/eleventy-img');
const { outdent } = require('outdent');
const { escape } = require('lodash');
const { dir, imagePaths } = require('../constants');
const { stringifyAttributes } = require('../utils');

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
    return outdent`<a class="outline-offset" href="${formatSizes[optimizedFormats[0]].largest.url}">${picture}</a>`;
  }

  // Otherwise just return the plain picture tag
  return outdent`${picture}`;
};

module.exports = imageShortcode;
