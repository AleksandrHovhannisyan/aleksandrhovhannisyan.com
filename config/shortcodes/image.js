const Image = require('@11ty/eleventy-img');
const { default: classNames } = require('classnames');
const { outdent } = require('outdent');
const path = require('path');
const { imagePaths, dir } = require('../constants');

const placeholderWidth = 24;

const images = {
  thumbnail: {
    widths: [null, placeholderWidth, 200, 400, 800],
    sizes: `(max-width: 400px) 400px, (max-width: 768px) 800px, 400px`,
  },
  'profile-photo': {
    widths: [null, placeholderWidth, 140, 400],
    sizes: `(max-width: 768px) 140px, 400px`,
  },
};

const imageFormats = ['jpeg', 'webp'];

const imageShortcode = async (relativeSrc, alt, className, id, clickable) => {
  const fullyQualifiedImagePath = path.join(imagePaths.source, relativeSrc);
  const { name } = path.parse(fullyQualifiedImagePath);
  const pathToImage = path.dirname(relativeSrc);

  const widths = images[name]?.widths ?? [null, placeholderWidth, 400, 800];
  const sizes = images[name]?.sizes ?? '100vw';

  const imageMetadata = await Image(fullyQualifiedImagePath, {
    widths,
    formats: imageFormats,
    // Output to same dest as site
    outputDir: path.join(imagePaths.output, pathToImage),
    // Public URL path referenced in the img tag's src
    urlPath: path.join(imagePaths.output.replace(dir.output, ''), pathToImage),
    // Custom file name
    filenameFormat: (id, src, width, format) => {
      return `${name}-${width === placeholderWidth ? 'placeholder' : width}.${format}`;
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
        .filter((image) => image.width !== placeholderWidth)
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
