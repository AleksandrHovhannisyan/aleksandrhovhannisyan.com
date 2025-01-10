import path from 'node:path';
import { dir } from '../../lib/constants.js';
import { toAbsoluteImageUrl } from '../../lib/filters.js';
import { validateBlogPostSchema } from '../../lib/schema.js';

const isProduction = process.env.ELEVENTY_ENV === 'production';

export default {
	eleventyDataSchema: validateBlogPostSchema,
	layout: 'post',
	permalink: (data) => {
		// Ignore/hide drafts on prod
		if (data?.isDraft && isProduction) {
			return false;
		}
		return `/blog/${data?.page?.fileSlug}/`;
	},
	isPost: true,
	eleventyComputed: {
		// Ignore/hide drafts on prod
		eleventyExcludeFromCollections: (data) => !!data.isDraft && isProduction,
		scripts: (data) => {
			const scripts = [
				...data.scripts,
				{
					type: 'module',
					src: '/assets/scripts/copyCode.js',
				},
			];
			// If the post has comments and comments are enabled, link to the comment script to load them
			if (data.commentsId) {
				scripts.push(...data.scripts, { type: 'module', src: `/assets/scripts/comments.js` });
			}
			return scripts;
		},
		openGraph: {
			type: 'article',
			// For social sharing. Used in og:image and twitter:image. Absolute path to the post's thumbnail image.
			// Thumbnails may be remote images (thumbnail.url) or local images (thumbnail as a string path, like ./images/thumbnail.png).
			image: (data) => {
				// TODO: add a fallback social preview image
				if (!data.thumbnail || !data.page.url) {
					return;
				}
				let src;
				// Remote image, no need to manipulate src as it's already an absolute path.
				if (data.thumbnail.match(/^https?:\/\//)) {
					src = data.thumbnail;
				} else {
					// Local blog post image with relative path (e.g., `./images/thumbnail.png`). Convert src to absolute path so the 11ty image plugin can find it.
					const { dir: blogPostSourceDirectory } = path.parse(data.page.inputPath);
					src = path.join(blogPostSourceDirectory, data.thumbnail);
				}
				// Save in same output directory as the post itself.
				const outputDir = path.join(dir.output, data.page.url);
				// OG images must be absolute URLs.
				return toAbsoluteImageUrl({ src, outputDir });
			},
		},
	},
};
