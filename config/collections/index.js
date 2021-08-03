const lodash = require('lodash');
const { getAllPosts, getAllUniqueKeyValues, slugifyString } = require('../utils');

const posts = (collection) => {
  return getAllPosts(collection).reverse();
};

const categories = (collection) => {
  const allPosts = getAllPosts(collection);
  const categories = getAllUniqueKeyValues(allPosts, 'categories').map((category) => ({
    title: category,
    slug: slugifyString(category),
  }));
  return categories;
};

// Blog posts by category, for pagination
// Credit: https://www.webstoemp.com/blog/basic-custom-taxonomies-with-eleventy/
const postsByCategory = (collection) => {
  const postsPerPage = 20;
  const blogPostsByCategory = [];

  const allPosts = getAllPosts(collection).reverse();
  const allUniqueCategories = getAllUniqueKeyValues(allPosts, 'categories');

  allUniqueCategories.forEach((category) => {
    // Get all posts belonging to this category
    const categoryPosts = allPosts.filter((post) => post.data.categories?.includes(category));

    // Create a 2D array of chunked posts, where each nested array represents a page.
    // e.g., if postsPerPage = 2 and we have three posts, then we'd get [[{post1}, {post2}], [{post3}]]
    const chunkedCategoryPosts = lodash.chunk(categoryPosts, postsPerPage);

    // Map each chunk to its page slug
    const categorySlug = slugifyString(category);
    const pageSlugs = chunkedCategoryPosts.map((_, i) => i > 0 ? `${categorySlug}/page/${i + 1}` : categorySlug);

    chunkedCategoryPosts.forEach((posts, index) => {
      // Massage the data into a format that 11ty's pagination will like
      // https://github.com/11ty/eleventy/issues/332#issuecomment-445236776
      blogPostsByCategory.push({
        title: category,
        slug: pageSlugs[index],
        pageNumber: index,
        totalPages: pageSlugs.length,
        pageSlugs: {
          all: pageSlugs,
          next: pageSlugs[index + 1] || null,
          previous: pageSlugs[index - 1] || null,
          first: pageSlugs[0] || null,
          last: pageSlugs[pageSlugs.length - 1] || null,
        },
        items: posts,
      });
    });
  });

  return blogPostsByCategory;
};

module.exports = {
  posts,
  categories,
  postsByCategory,
};
