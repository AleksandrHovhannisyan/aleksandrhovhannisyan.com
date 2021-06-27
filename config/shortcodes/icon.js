const feather = require('feather-icons');

// Can't pass objects as arguments :(
const imageShortcode = (icon, className, width, height, stroke, fill, strokeWidth, strokeLinecap, strokeLinejoin) => {
  try {
    return feather.icons[icon].toSvg({
      class: className,
      width,
      height,
      stroke,
      fill,
      'stroke-width': strokeWidth,
      'stroke-linecap': strokeLinecap,
      'stroke-linejoin': strokeLinejoin,
    });
  } catch (e) {
    console.error(e);
  }
};

module.exports = imageShortcode;
