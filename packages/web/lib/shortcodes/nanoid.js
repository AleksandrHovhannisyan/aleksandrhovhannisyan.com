import crypto from 'crypto';

/**
 * @param {number} length The length of the ID to generate.
 */
export default function nanoid(length = 6, prefix = 'id-') {
	return `${prefix}${crypto.randomUUID().substring(0, length)}`;
}
