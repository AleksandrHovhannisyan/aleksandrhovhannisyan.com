const lodash = require('lodash');
const { getAllUniqueKeyValues, slugifyString } = require('../utils');
const site = require('../../src/_data/site');
const { limit } = require('../filters');
const { dir } = require('../constants');

/** Returns all blog posts as a collection. */
const getAllPosts = (collection) => {
  const posts = collection.getFilteredByGlob(`${dir.input}/_posts/*.md`);
  return posts.reverse();
};

/** Returns all unique categories as a collection. */
const getAllUniqueCategories = (collection) => {
  const allPosts = getAllPosts(collection);
  const categories = getAllUniqueKeyValues(allPosts, 'categories').map((category) => ({
    title: category,
    slug: slugifyString(category),
  }));
  return categories;
};

// Blog posts by category, for pagination
// Adapted for use from: https://www.webstoemp.com/blog/basic-custom-taxonomies-with-eleventy/
const getPostsByCategory = (collection) => {
  const postsPerPage = site.pagination.itemsPerPage;
  const blogPostsByCategory = [];

  const allPosts = getAllPosts(collection);
  const allUniqueCategories = getAllUniqueKeyValues(allPosts, 'categories');

  allUniqueCategories.forEach((category) => {
    // Get all posts belonging to this category
    const categoryPosts = allPosts.filter((post) => post.data.categories?.includes(category));

    // Create a 2D array of chunked posts, where each nested array represents a page.
    // e.g., if postsPerPage = 2 and we have three posts, then we'd get [[{post1}, {post2}], [{post3}]]
    const chunkedCategoryPosts = lodash.chunk(categoryPosts, postsPerPage);

    // Map each chunk to its page slug
    const categorySlug = slugifyString(category);
    const pageHrefs = chunkedCategoryPosts.map((_, i) =>
      i > 0 ? `/categories/${categorySlug}/page/${i + 1}/` : `/categories/${categorySlug}/`
    );

    chunkedCategoryPosts.forEach((posts, index) => {
      // Massage the data into a format that 11ty's pagination will like
      // https://github.com/11ty/eleventy/issues/332#issuecomment-445236776
      blogPostsByCategory.push({
        title: category,
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

/** Returns all categories with the number of posts in each, in descending order. */
const getCategoriesWithDescendingCount = (collection) => {
  const postsByCategory = getPostsByCategory(collection);
  const categoriesWithCount = postsByCategory
    .map((category) => ({ title: category.title, href: category.href, count: category.posts.length }))
    .sort((a, b) => b.count - a.count);
  return categoriesWithCount;
};

/** Returns the top `n` categories with at least `minCount` posts, in descending order. */
const getPopularCategories = (params) => (collection) => {
  const categoriesWithDescendingCount = getCategoriesWithDescendingCount(collection).filter(
    (category) => category.count >= params.minCount
  );
  const popularCategories = limit(categoriesWithDescendingCount, params.limit);
  return popularCategories;
};

module.exports = {
  getAllPosts,
  getAllUniqueCategories,
  getPostsByCategory,
  getCategoriesWithDescendingCount,
  getPopularCategories,
};
