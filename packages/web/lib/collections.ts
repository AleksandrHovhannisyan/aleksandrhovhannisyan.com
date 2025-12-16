import type { BlogPostFrontMatter } from '../src/_posts/_posts.11tydata.ts';
import { slugifyString } from './utils/string.ts';

type PostCollectionEntry = { data: BlogPostFrontMatter };

/** Returns all blog posts as a collection. */
export function getAllPosts(collection): PostCollectionEntry[] {
  const posts = collection.getFilteredByGlob('src/_posts/**/*.md') as PostCollectionEntry[];
  return posts.reverse().filter((post) => !post.data.isArchived);
}

/** Given a category name, returns the root-relative URL to that category's page.
 */
function getCategoryHref(category: string) {
  if (category === 'note') {
    return `/notes/`;
  }
  return `/tags/${slugifyString(category)}/`;
}

/** Returns all unique categories as a collection.
 * NOTE: I'm calling these "categories" to distinguish them from 11ty's built-in "tags." However,
 * these are still referred to as tags in the UI since that's what's most common.
 */
export function getAllUniqueCategories(collection): { name: string; href: string; count: number }[] {
  const allPosts = getAllPosts(collection);

  const categoryCounts: Map<string, number> = allPosts.reduce((categoryCounts: Map<string, number>, post) => {
    post.data.categories?.forEach((category: string) => {
      const count = categoryCounts.get(category) ?? 0;
      categoryCounts.set(category, count + 1);
    });
    return categoryCounts;
  }, new Map());

  return Array.from(categoryCounts.entries())
    .map(([category, count]) => ({
      name: category,
      href: getCategoryHref(category),
      count,
    }))
    .sort((a, b) => {
      // If names start with the same letter, sort by count descending (popular tags first)
      if (a.name[0].localeCompare(b.name[0], undefined, { sensitivity: 'base' }) === 0) {
        return b.count - a.count;
      }
      // Otherwise, sort by name
      return a.name.localeCompare(b.name);
    });
}

// Blog posts by category, for pagination
// Adapted for use from: https://www.webstoemp.com/blog/basic-custom-taxonomies-with-eleventy/
export function getPostsByCategory(collection) {
  const allPosts = getAllPosts(collection);
  const allUniqueCategories = getAllUniqueCategories(collection);

  // Massage the data into a format that 11ty's pagination will like
  // https://github.com/11ty/eleventy/issues/332#issuecomment-445236776
  const blogPostsByCategory = allUniqueCategories.map((category) => ({
    name: category.name,
    href: getCategoryHref(category.name),
    posts: allPosts.filter((post) => !!post.data.categories?.includes(category.name)),
  }));
  return blogPostsByCategory;
}
