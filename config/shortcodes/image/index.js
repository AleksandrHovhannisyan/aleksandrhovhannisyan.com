const Image = require('@11ty/eleventy-img');
const { default: classNames } = require('classnames');
const { outdent } = require('outdent');
const path = require('path');
const { escape } = require('lodash');
const { dir } = require('../../constants');
const { stringifyAttributes } = require('../../utils');

const ImageWidths = {
  /** The original (source) image width. */
  ORIGINAL: null,
  /** The width of placeholder images (for lazy loading). Aspect ratio is preserved. */
  PLACEHOLDER: 24,
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
    clickable = true,
    // mainly for remote images
    urlPath,
    fileName,
  } = props ?? {};

  const isRemoteImage = /https?:\/\//.test(src);
  let imgName, imgDir, absoluteSrc;

  if (isRemoteImage) {
    // For remote images, these pieces are passed in separately, and the input src IS the absolute src
    imgName = fileName;
    imgDir = urlPath;
    absoluteSrc = src;
  } else {
    // For non-remote images, it's expected that the input src specify the full relative src to the image.
    const { name: parsedName, dir: parsedDir } = path.parse(src);
    imgName = parsedName;
    imgDir = parsedDir;
    absoluteSrc = path.join(dir.input, src);
  }

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
  const imageMetadata = await Image(absoluteSrc, imageOptions);

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
  const sharedImgAttributes = stringifyAttributes({
    width,
    height,
    alt: escape(alt),
    loading: 'lazy',
  });
  const lazyImgAttributes = stringifyAttributes({
    src: formatSizes[baseFormat].placeholder.url,
    'data-src': formatSizes[baseFormat].largest.url,
    class: 'lazy-img',
  });
  const noscriptImgAttributes = stringifyAttributes({
    src: formatSizes[baseFormat].largest.url,
  });

  /** Returns source elements as an HTML string. */
  const sourceHtmlString = Object.values(imageMetadata)
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

      const sourceAttributes = stringifyAttributes({
        type: sourceType,
        srcset: placeholderSrcset,
        'data-srcset': actualSrcset,
        'data-sizes': sizes,
      });

      return `<source ${sourceAttributes}>`;
    })
    .join('\n');

  // Custom image markup. Picture tag with lazy img/sources + noscript fallbacks.
  // https://eszter.space/noscript-lazy-load/. Medium also does this.
  const picture = `<picture class="${classNames('lazy-picture', className)}">
  ${sourceHtmlString}
    <img ${lazyImgAttributes} ${sharedImgAttributes}>
    <noscript>
      <img ${noscriptImgAttributes} ${sharedImgAttributes}>
    </noscript>
  </picture>`;

  // Link to the highest resolution optimized image
  if (clickable) {
    return outdent`<a href="${formatSizes[optimizedFormats[0]].largest.url}">${picture}</a>`;
  }

  // Otherwise just return the plain picture tag
  return outdent`${picture}`;
};

module.exports = imageShortcode;
