import path from 'node:path';
import { toAbsoluteImageUrl } from '../../../lib/filters.js';

/**
 * @type {Partial<import('../../../lib/schema.js').FrontMatter>}
 */
const data = {
  eleventyComputed: {
    /**
     * @param {import('../../../lib/schema.js').FrontMatter & import('../../../lib/schema.js').EleventyPageData} data
     */
    openGraph: async (data) => {
      const image = data.page.url
        ? await toAbsoluteImageUrl({
            src: 'src/_pages/art/og-art.png',
            outputDir: path.join(data.eleventy.directories.output, data.page.url),
          })
        : undefined;
      return {
        card: 'summary_large_image',
        image,
      };
    },
  },
};

export default data;
