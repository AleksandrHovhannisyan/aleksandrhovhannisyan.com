const { toAbsoluteUrl } = require('../../config/filters');

module.exports = {
  layout: 'default',
  ogImage: toAbsoluteUrl('/assets/images/profile-photo.jpg'),
};
