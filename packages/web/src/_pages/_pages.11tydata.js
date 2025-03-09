import { BASE_FRONT_MATTER_SCHEMA, makeSchemaValidator } from '../../lib/schema.js';

export default {
  layout: 'default',
  eleventyDataSchema: makeSchemaValidator(BASE_FRONT_MATTER_SCHEMA),
};
