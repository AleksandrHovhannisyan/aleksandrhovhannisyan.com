import * as v from 'valibot';
import { makeSchemaValidator, FrontMatter, NON_EMPTY_STRING } from '../../lib/schema.js';

const NoteFrontMatter = v.object({
  ...FrontMatter.entries,
  thumbnail: v.optional(NON_EMPTY_STRING),
});

/**
 * @typedef {v.InferInput<typeof NoteFrontMatter>} NoteFrontMatter
 */

/**
 * @typedef {NoteFrontMatter & import('../../lib/schema.js').EleventyPageData} NotePageData
 */

/**
 * @type {Partial<NoteFrontMatter>}
 */
const data = {
  eleventyDataSchema: makeSchemaValidator(NoteFrontMatter),
  layout: 'note',
  tags: ['notes'],
  /**
   * @param {NotePageData} data
   */
  permalink: (data) => `/notes/${data?.page?.fileSlug}/`,
  eleventyComputed: {
    scripts: [
      {
        type: 'module',
        src: '/assets/scripts/copyCode.js',
      },
    ],
  },
};

export default data;
