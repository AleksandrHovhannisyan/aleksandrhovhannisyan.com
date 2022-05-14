const { toAbsoluteImageUrl } = require('../../config/filters');

module.exports = {
  layout: 'default',
  ogImage: toAbsoluteImageUrl('src/assets/images/profile-photo.jpg', 400),
};
