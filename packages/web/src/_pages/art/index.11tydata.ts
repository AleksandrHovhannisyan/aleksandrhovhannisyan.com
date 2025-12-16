import path from 'node:path';
import { toAbsoluteImageUrl } from '../../../lib/filters.ts';
import type { EleventyPageData, FrontMatter } from '../../../lib/schema.ts';

/**
 * @type {Partial<import('../../../lib/schema.js').FrontMatter>}
 */
const data: Partial<FrontMatter> = {
  eleventyComputed: {
    openGraph: async (data: FrontMatter & EleventyPageData) => {
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
