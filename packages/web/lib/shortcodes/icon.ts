import { icons, type FeatherAttributes } from 'feather-icons';

interface IconProps extends Pick<FeatherAttributes, 'stroke' | 'fill'> {
  icon: string;
  className: string;
  size: number;
  strokeWidth: number;
  strokeLinecap: 'butt' | 'round' | 'square';
  strokeLinejoin: 'butt' | 'round' | 'square';
}

export default function iconShortcode(props: Partial<IconProps>) {
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
  return icons[icon].toSvg({
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
