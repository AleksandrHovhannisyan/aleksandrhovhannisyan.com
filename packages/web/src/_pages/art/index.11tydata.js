import path from 'node:path';
import { toAbsoluteImageUrl } from '../../../lib/filters.js';

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
          outputDir: path.join(data.eleventy.directories.output, data.page.url),
        });
      },
    },
  },
};
