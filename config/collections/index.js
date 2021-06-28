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
  const itemsPerPage = 20;
  const blogPostsByCategory = [];

  const allPosts = getAllPosts(collection).reverse();
  const allUniqueCategories = getAllUniqueKeyValues(allPosts, 'categories');

  // Get an array of all posts in this category
  allUniqueCategories.forEach((category) => {
    const postsInThisCategory = allPosts.filter((post) => {
      const selfCategories = post.data.categories ?? [];
      return selfCategories.includes(category);
    });

    // create a 2D array of chunked posts, where each nested array represents a page.
    // e.g., if itemsPerPage = 2 and we have three posts, then we'd get [[{post1}, {post2}], [{post3}]]
    const chunkedPostsInCategory = lodash.chunk(postsInThisCategory, itemsPerPage);

    // Map each chunk to its page slug
    const pageSlugs = chunkedPostsInCategory.map((_, i) => {
      const categorySlug = slugifyString(category);
      const pageSlug = i > 0 ? `${categorySlug}/page/${i + 1}` : categorySlug;
      return pageSlug;
    });

    chunkedPostsInCategory.forEach((posts, index) => {
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
