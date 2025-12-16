import crypto from 'crypto';

export default function nanoid(length: number = 6, prefix = 'id-') {
  return `${prefix}${crypto.randomUUID().substring(0, length)}`;
}
