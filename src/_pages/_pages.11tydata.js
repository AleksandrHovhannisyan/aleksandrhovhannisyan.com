import { toAbsoluteImageUrl } from '../../config/filters/filters.js';

export default {
  layout: 'default',
  openGraph: {
    type: 'website',
    image: toAbsoluteImageUrl('src/assets/images/profile-photo.jpg', 400),
  },
};
