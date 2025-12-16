import { FrontMatter, makeSchemaValidator } from '../../lib/schema.ts';

const data: Partial<FrontMatter> = {
  layout: 'default',
  eleventyDataSchema: makeSchemaValidator(FrontMatter),
};

export default data;
