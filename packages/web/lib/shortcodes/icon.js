import feather from 'feather-icons';

/**
 * @typedef IconProps
 * @property {string} icon
 * @property {string} className
 * @property {number} size
 * @property {string} stroke
 * @property {string} fill
 * @property {number} strokeWidth
 * @property {'butt'|'round'|'square'} strokeLinecap
 * @property {'butt'|'round'|'square'} strokeLinejoin
 */

/**
 * @param {IconProps} props
 */
export default function iconShortcode(props) {
  const {
    icon,
    className,
    size = 24,
    stroke = 'currentColor',
    fill = 'none',
    strokeWidth = 2,
    strokeLinecap = 'round',
    strokeLinejoin = 'round',
  } = props ?? {};
  return feather.icons[icon].toSvg({
    class: className,
    width: size,
    height: size,
    stroke,
    fill,
    'stroke-width': strokeWidth,
    'stroke-linecap': strokeLinecap,
    'stroke-linejoin': strokeLinejoin,
  });
}
