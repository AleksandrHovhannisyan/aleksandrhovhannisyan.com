import path from 'node:path';
import { toAbsoluteImageUrl } from '../../../lib/filters.js';
import { dir } from '../../../lib/constants.js';

export default {
  eleventyComputed: {
    openGraph: {
      twitter: {
        card: 'summary_large_image',
      },
      image: (data) => {
        if (!data.page.url) return;
        return toAbsoluteImageUrl({
          src: 'src/_pages/art/og-art.png',
          outputDir: path.join(dir.output, data.page.url),
        });
      },
    },
  },
};
