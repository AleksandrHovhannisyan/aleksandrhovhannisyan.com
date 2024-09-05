import { toAbsoluteImageUrl } from '../../lib/filters/filters.js';

export default {
  layout: 'default',
  openGraph: {
    type: 'website',
    image: toAbsoluteImageUrl({ src: 'src/assets/images/profile-photo.jpg', width: 400 }),
  },
};
