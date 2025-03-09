import * as v from 'valibot';
import { makeSchemaValidator, BASE_FRONT_MATTER_SCHEMA, NON_EMPTY_STRING } from '../../lib/schema.js';

const NOTE_SCHEMA = v.object({
  ...BASE_FRONT_MATTER_SCHEMA.entries,
  thumbnail: v.optional(NON_EMPTY_STRING),
});

export default {
  eleventyDataSchema: makeSchemaValidator(NOTE_SCHEMA),
  layout: 'note',
  tags: ['notes'],
  permalink: (data) => `/notes/${data?.page?.fileSlug}/`,
  eleventyComputed: {
    scripts: (data) => {
      return [
        ...data.scripts,
        {
          type: 'module',
          src: '/assets/scripts/copyCode.js',
        },
      ];
    },
  },
};
