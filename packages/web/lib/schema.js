import { z } from 'zod';
import { fromZodError } from 'zod-validation-error';

export const BLOG_POST_SCHEMA = z.object({
	title: z.string().nonempty(),
	description: z.string().nonempty(),
	layout: z.string().optional(),
	keywords: z.array(z.string()).optional(),
	categories: z.array(z.string()).optional(),
	thumbnail: z.string().optional(),
	lastUpdated: z.date().optional(),
	commentsId: z.number().optional(),
	redirectFrom: z.union([z.string().optional(), z.array(z.string()).optional()]),
	isFeatured: z.boolean().optional(),
	isDraft: z.boolean().optional(),
});

export function validateBlogPostSchema(data) {
	const result = BLOG_POST_SCHEMA.safeParse(data);
	if (result.error) {
		throw fromZodError(result.error);
	}
}
