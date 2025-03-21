import { FrontMatter, makeSchemaValidator } from '../../lib/schema.js';

/**
 * @type {Partial<import('../../lib/schema.js').FrontMatter>}
 */
const data = {
  layout: 'default',
  eleventyDataSchema: makeSchemaValidator(FrontMatter),
};

export default data;
