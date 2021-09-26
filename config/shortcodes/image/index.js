const Image = require('@11ty/eleventy-img');
const { default: classNames } = require('classnames');
const { outdent } = require('outdent');
const path = require('path');
const { escape } = require('lodash');
const { dir } = require('../../constants');

const ImageWidths = {
  /** The original (source) image width. */
  ORIGINAL: null,
  /** The width of placeholder images (for lazy loading). Aspect ratio is preserved. */
  PLACEHOLDER: 24,
};

const imageShortcode = async (relativeSrc, props) => {
  const {
    alt = '',
    baseFormat = 'jpeg',
    optimizedFormats = ['webp'],
    widths = [400, 800],
    sizes = '100vw',
    className,
    clickable = true,
  } = props ?? {};

  const { name: imgName, dir: imgDir } = path.parse(relativeSrc);
  const fullyQualifiedSrc = path.join(dir.input, relativeSrc);

  const imageOptions = {
    // Templates shouldn't have to worry about passing in `null` and the placeholder width
    widths: [ImageWidths.ORIGINAL, ImageWidths.PLACEHOLDER, ...widths],
    // List optimized formats before the base format so that the output contains webp sources before jpegs.
    formats: [...optimizedFormats, baseFormat],
    // Where the generated image files get saved
    outputDir: path.join(dir.output, imgDir),
    // Public URL path that's referenced in the img tag's src attribute
    urlPath: imgDir,
    // Custom file name
    filenameFormat: (_id, _src, width, format) => {
      const suffix = width === ImageWidths.PLACEHOLDER ? 'placeholder' : width;
      return `${imgName}-${suffix}.${format}`;
    },
  };
  const imageMetadata = await Image(fullyQualifiedSrc, imageOptions);

  // Map each unique format (e.g., jpeg, webp) to its smallest and largest images
  const formatSizes = Object.entries(imageMetadata).reduce((formatSizes, [format, images]) => {
    if (!formatSizes[format]) {
      // These will always exist
      const placeholder = images.find((image) => image.width === ImageWidths.PLACEHOLDER);
      const largestVariant = images[images.length - 1];

      formatSizes[format] = {
        placeholder,
        largest: largestVariant,
      };
    }
    return formatSizes;
  }, {});

  const { width, height } = formatSizes[baseFormat].largest;

  // Return custom image markup
  const picture = `<picture class="${classNames('lazy-picture', className)}">
  ${Object.values(imageMetadata)
    // Map each format to the source HTML markup
    .map((formatEntries) => {
      // The first entry is representative of all the others since they each have the same shape
      const { format: formatName, sourceType } = formatEntries[0];

      const placeholderSrcset = formatSizes[formatName].placeholder.url;
      const actualSrcset = formatEntries
        // We don't need the placeholder image in the srcset
        .filter((image) => image.width !== ImageWidths.PLACEHOLDER)
        // All non-placeholder images get mapped to their srcset
        .map((image) => image.srcset)
        .join(', ');

      return `<source type="${sourceType}" srcset="${placeholderSrcset}" data-srcset="${actualSrcset}" data-sizes="${sizes}">`;
    })
    .join('\n')}
    <img
      src="${formatSizes[baseFormat].placeholder.url}"
      data-src="${formatSizes[baseFormat].largest.url}"
      width="${width}"
      height="${height}"
      alt="${escape(alt)}"
      class="lazy-img"
      loading="lazy">
  </picture>`;

  // Link to the highest resolution optimized image
  if (clickable) {
    return outdent`<a href="${formatSizes[optimizedFormats[0]].largest.url}">${picture}</a>`;
  }

  // Otherwise just return the plain picture tag
  return outdent`${picture}`;
};

module.exports = imageShortcode;
