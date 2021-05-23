const commentsSection = document.querySelector('#comments');
const commentsWrapper = document.querySelector('#comments-wrapper');
const repo = commentsSection.getAttribute('data-comments-repo');
const commentsId = commentsSection.getAttribute('data-comments-id');

// Optimization: Defer GitHub API request until users reach the comments footer.
const commentsObserver = new IntersectionObserver(
  (entries, self) => {
    entries.forEach(async (entry) => {
      if (entry.isIntersecting) {
        // Make this script super tiny by deferring the import for these utils.
        // Otherwise, it's wasteful to write all the code in this file.
        const { fetchComments, renderComments } = await import('@utils');

        fetchComments({ repo, issueId: commentsId })
          .then(renderComments)
          .catch(() => {
            commentsWrapper.innerHTML = `<p>Unable to retrieve the comments for this post. Check back later.</p>`;
          });
        self.unobserve(entry.target);
      }
    });
  },
  { rootMargin: '200px 0px 0px 0px' }
);

// Once the user reaches the comments section, we'll load
// all our dependencies and render the comments.
commentsObserver.observe(commentsSection);
