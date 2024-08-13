const commentsSection = document.querySelector('#comments');
const commentsPlaceholder = document.querySelector('#comments-placeholder');
const commentsId = commentsSection.getAttribute('data-comments-id');

// Optimization: Defer GitHub API request until users reach the comments footer.
const commentsObserver = new IntersectionObserver(
  (entries, self) => {
    entries.forEach(async (entry) => {
      if (entry.isIntersecting) {
        // Don't need this until they reach the comments section
        const { fetchComments, renderComments, CommentsError } = await import('./utils/comments.utils.mjs');
        try {
          const comments = await fetchComments(commentsId);
          renderComments(comments);
        } catch (error) {
          // Custom/known error that we threw
          if (error instanceof CommentsError) {
            commentsPlaceholder.innerHTML = error.message;
          } else {
            // This should hopefully never happen
            commentsPlaceholder.innerHTML = 'An unexpected error occurred while fetching comments.';
          }
        }
        self.unobserve(entry.target);
      }
    });
  },
  { rootMargin: '200px 0px 0px 0px' }
);

// Once the user reaches the comments section, we'll load
// all our dependencies and render the comments.
commentsObserver.observe(commentsSection);
