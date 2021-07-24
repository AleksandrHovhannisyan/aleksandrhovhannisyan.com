const Image = require('@11ty/eleventy-img');
const { default: classNames } = require('classnames');
const { outdent } = require('outdent');
const path = require('path');
const { escape } = require('lodash');
const { imagePaths, dir } = require('../constants');

const ImageWidths = {
  /** The original (source) image width. */
  ORIGINAL: null,
  /** The width of placeholder images (for lazy loading). Aspect ratio is preserved. */
  PLACEHOLDER: 24,
};

const OPTIMIZED_IMAGE_FORMATS = ['webp'];

/** Images that need special attention/prop customization. */
const specialImages = {
  thumbnail: {
    widths: [ImageWidths.ORIGINAL, ImageWidths.PLACEHOLDER, 200, 400, 800],
    sizes: `(max-width: 400px) 400px, (max-width: 768px) 800px, 400px`,
  },
  'profile-photo': {
    widths: [ImageWidths.ORIGINAL, ImageWidths.PLACEHOLDER, 280, 400],
    sizes: `(max-width: 768px) 280px, 400px`,
  },
  'author-photo': {
    widths: [ImageWidths.ORIGINAL, ImageWidths.PLACEHOLDER, 44, 88],
  },
  favicon: {
    widths: [ImageWidths.PLACEHOLDER, 32, 57, 76, 96, 128, 192, 228],
    formats: {
      base: 'png',
      other: OPTIMIZED_IMAGE_FORMATS,
    },
    // Really only need this one for the navbar logo. Other sizes are generated for the real favicon.
    sizes: '57px',
  },
};

/** Defaults/fallbacks for any other image that isn't a "special" image. */
const imageDefaults = {
  widths: [ImageWidths.ORIGINAL, ImageWidths.PLACEHOLDER, 400, 800],
  formats: {
    base: 'jpeg',
    other: OPTIMIZED_IMAGE_FORMATS,
  },
  sizes: '100vw',
};

const imageShortcode = async (relativeSrc, alt, className, id, clickable) => {
  const fullyQualifiedImagePath = path.join(imagePaths.source, relativeSrc);
  const { name } = path.parse(fullyQualifiedImagePath);
  const pathToImage = path.dirname(relativeSrc);

  const widths = specialImages[name]?.widths ?? imageDefaults.widths;
  const sizes = specialImages[name]?.sizes ?? imageDefaults.sizes;
  let formats = specialImages[name]?.formats ?? imageDefaults.formats;
  const baseFormat = formats.base;
  formats = [baseFormat, ...formats.other];

  const imageMetadata = await Image(fullyQualifiedImagePath, {
    widths,
    formats,
    // Where the generated image files get saved
    outputDir: path.join(imagePaths.output, pathToImage),
    // Public URL path that's referenced in the img tag's src attribute
    urlPath: path.join(imagePaths.output.replace(dir.output, ''), pathToImage),
    // Custom file name
    filenameFormat: (_id, _src, width, format) => {
      return `${name}-${width === ImageWidths.PLACEHOLDER ? 'placeholder' : width}.${format}`;
    },
  });

  // Map each unique format (e.g., jpeg, wepb) to its smallest and largest images
  const formatSizes = Object.keys(imageMetadata).reduce((formatSizes, uniqueFormat) => {
    if (!formatSizes[uniqueFormat]) {
      formatSizes[uniqueFormat] = {
        smallest: imageMetadata[uniqueFormat][0],
        largest: imageMetadata[uniqueFormat][imageMetadata[uniqueFormat].length - 1],
      };
    }
    return formatSizes;
  }, {});

  // Aspect ratio sizing (manual for browsers that don't yet support aspect-ratio)
  const { width, height } = formatSizes[baseFormat].largest;
  const aspectRatio = (height / width) * 100.0;

  const picture = `<picture class="${classNames('lazy-picture', className)}" ${
    id ? `id="${id}"` : ''
  } style="--aspect-ratio: ${aspectRatio}%;">
  ${Object.values(imageMetadata)
    // Prioritize optimized sources since browser loads first valid one it encounters
    .sort((sourcesA, sourcesB) => {
      if (OPTIMIZED_IMAGE_FORMATS.includes(sourcesA[0].format)) return -1;
      if (OPTIMIZED_IMAGE_FORMATS.includes(sourcesB[0].format)) return 1;
      return 0;
    })
    // Map each format to the source HTML markup
    .map((formatEntries) => {
      // The first entry is representative of all the others since they each have the same shape
      const { format: formatName, sourceType } = formatEntries[0];

      const placeholderSrcset = formatSizes[formatName].smallest.url;
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
      src="${formatSizes[baseFormat].smallest.url}"
      data-src="${formatSizes[baseFormat].largest.url}"
      width="${width}"
      height="${height}"
      alt="${escape(alt)}"
      class="lazy-img"
      loading="lazy">
  </picture>`;

  // Link to the highest resolution optimized image
  if (clickable) {
    return outdent`<a href="${formatSizes[OPTIMIZED_IMAGE_FORMATS[0]].largest.url}">${picture}</a>`;
  }

  // Otherwise just return the plain picture tag
  return outdent`${picture}`;
};

module.exports = imageShortcode;
