import { icons, type FeatherAttributes, type FeatherStrokeLineCap, type FeatherStrokeLineJoin } from 'feather-icons';

interface IconProps extends Pick<FeatherAttributes, 'stroke' | 'fill'> {
  icon: keyof typeof icons;
  className: string;
  size: number;
  strokeWidth: number;
  strokeLinecap: FeatherStrokeLineCap;
  strokeLinejoin: FeatherStrokeLineJoin;
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
