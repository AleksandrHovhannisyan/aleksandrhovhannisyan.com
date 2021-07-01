const Image = require('@11ty/eleventy-img');
const { default: classNames } = require('classnames');
const { outdent } = require('outdent');
const path = require('path');
const { imagePaths, dir } = require('../constants');

// Alias Eleventy's convention of null = original [width/format/etc] for clarity
const ORIGINAL = null;

const ImageWidths = {
  /** The original (source) image width. */
  ORIGINAL,
  /** The width of placeholder images (for lazy loading). Aspect ratio is preserved. */
  PLACEHOLDER: 24,
}

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
  }
};

/** Defaults/fallbacks for any other image that isn't a "special" image. */
const imageDefaults = {
  widths: [ImageWidths.ORIGINAL, ImageWidths.PLACEHOLDER, 400, 800],
  formats: ['jpeg', 'webp'],
  sizes: '100vw',
}

const imageShortcode = async (relativeSrc, alt, className, id, clickable) => {
  const fullyQualifiedImagePath = path.join(imagePaths.source, relativeSrc);
  const { name } = path.parse(fullyQualifiedImagePath);
  const pathToImage = path.dirname(relativeSrc);

  const widths = specialImages[name]?.widths ?? imageDefaults.widths;
  const sizes = specialImages[name]?.sizes ?? imageDefaults.sizes;
  const formats = specialImages[name]?.formats ?? imageDefaults.formats;

  const imageMetadata = await Image(fullyQualifiedImagePath, {
    widths,
    formats,
    // Output to same dest as site
    outputDir: path.join(imagePaths.output, pathToImage),
    // Public URL path referenced in the img tag's src
    urlPath: path.join(imagePaths.output.replace(dir.output, ''), pathToImage),
    // Custom file name
    filenameFormat: (id, src, width, format) => {
      return `${name}-${width === ImageWidths.PLACEHOLDER ? 'placeholder' : width}.${format}`;
    },
  });

  const smallest = {
    jpeg: imageMetadata.jpeg[0],
    webp: imageMetadata.webp[0],
  };

  const largest = {
    jpeg: imageMetadata.jpeg[imageMetadata.jpeg.length - 1],
    webp: imageMetadata.webp[imageMetadata.webp.length - 1],
  };

  // Aspect ratio sizing (manual for browsers that don't yet support aspect-ratio)
  const { width, height } = largest.jpeg;
  const aspectRatio = (height / width) * 100.0;

  const picture = `<picture class="${classNames('lazy-picture', className)}" ${
    id ? `id="${id}"` : ''
  } style="--aspect-ratio: ${aspectRatio}%;">
  ${Object.values(imageMetadata)
    // Prioritize WebP sources since browser loads first valid one
    .sort((a, b) => {
      if (a[0].format === 'webp') return -1;
      if (b[0].format === 'webp') return 1;
      return 0;
    })
    .map((format) => {
      return `<source class="lazy-source" type="${format[0].sourceType}" srcset="${
        smallest[format[0].format].url
      }" data-srcset="${format
        // We don't need the placeholder image in the srcset
        .filter((image) => image.width !== ImageWidths.PLACEHOLDER)
        // All non-placeholder images get mapped to their srcset
        .map((image) => image.srcset)
        .join(', ')}" data-sizes="${sizes}">`;
    })
    .join('\n')}
    <img
      src="${smallest.jpeg.url}"
      data-src="${largest.jpeg.url}"
      width="${width}"
      height="${height}"
      alt="${alt}"
      class="lazy-img"
      loading="lazy">
  </picture>`;

  // Link to the highest resolution WebP image
  if (clickable) {
    return outdent`<a href="${largest.webp.url}">${picture}</a>`;
  }

  // Otherwise just return the plain picture tag
  return outdent`${picture}`;
};

module.exports = imageShortcode;
