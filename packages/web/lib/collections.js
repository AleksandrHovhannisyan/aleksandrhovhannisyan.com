import chunk from 'lodash/chunk.js';
import { slugifyString } from './utils.js';
import { dir } from './constants.js';

/** Returns all blog posts as a collection. */
export const getAllPosts = (collection) => {
  const posts = collection.getFilteredByGlob(`${dir.input}/_posts/**/*.md`);
  return posts.reverse().filter((post) => !post.data.isArchived);
};

/** Given a category name and an optional page number, returns the root-relative URL to that category's page.
 * @param {string} category
 * @param {number} [page] The one-indexed page number
 */
export const getCategoryHref = (category, page) => {
  const slug = slugifyString(category);
  return page > 1 ? `/tags/${slug}/page/${page}/` : `/tags/${slug}/`;
};

/** Returns all unique categories as a collection.
 * NOTE: I'm calling these "categories" to distinguish them from 11ty's built-in "tags." However,
 * these are still referred to as tags in the UI since that's what's most common.
 * @returns {({ title: string; href: string; count: string })[]}
 */
export const getAllUniqueCategories = (collection) => {
  const allPosts = getAllPosts(collection);

  /** @type {Map<string, number>} */
  const categoryCounts = allPosts.reduce((categoryCounts, post) => {
    post.data.categories?.forEach((category) => {
      const count = categoryCounts.get(category) ?? 0;
      categoryCounts.set(category, count + 1);
    });
    return categoryCounts;
  }, new Map());

  return (
    Array.from(categoryCounts.entries())
      .map(([category, count]) => ({
        title: category,
        href: getCategoryHref(category),
        count,
      }))
      // Sort by name first
      .sort((a, b) => a.title.localeCompare(b.title))
      // And then by popular categories first
      .sort((a, b) => b.count - a.count)
  );
};

// Blog posts by category, for pagination
// Adapted for use from: https://www.webstoemp.com/blog/basic-custom-taxonomies-with-eleventy/
export const getPostsByCategory = (collection) => {
  const postsPerPage = 100;
  const blogPostsByCategory = [];

  const allPosts = getAllPosts(collection);
  const allUniqueCategories = getAllUniqueCategories(collection);

  allUniqueCategories.forEach((category) => {
    // Get all posts belonging to this category
    const categoryPosts = allPosts.filter((post) => post.data.categories?.includes(category.title));

    // Create a 2D array of chunked posts, where each nested array represents a page.
    // e.g., if postsPerPage = 2 and we have three posts, then we'd get [[{post1}, {post2}], [{post3}]]
    const chunkedCategoryPosts = chunk(categoryPosts, postsPerPage);

    // Map each chunk to its page slug
    const pageHrefs = chunkedCategoryPosts.map((_, pageIndex) => getCategoryHref(category.title, pageIndex + 1));

    chunkedCategoryPosts.forEach((posts, index) => {
      // Massage the data into a format that 11ty's pagination will like
      // https://github.com/11ty/eleventy/issues/332#issuecomment-445236776
      blogPostsByCategory.push({
        title: category.title,
        href: pageHrefs[index],
        pageNumber: index,
        totalPages: pageHrefs.length,
        hrefs: {
          all: pageHrefs,
          next: pageHrefs[index + 1] || null,
          previous: pageHrefs[index - 1] || null,
          first: pageHrefs[0] || null,
          last: pageHrefs[pageHrefs.length - 1] || null,
        },
        posts,
      });
    });
  });

  return blogPostsByCategory;
};
