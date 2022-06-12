const crypto = require('crypto');

/**
 * @param {number} length The length of the ID to generate.
 */
module.exports = (length = 6, prefix = 'id-') => `${prefix}${crypto.randomUUID().substring(0, length)}`;
