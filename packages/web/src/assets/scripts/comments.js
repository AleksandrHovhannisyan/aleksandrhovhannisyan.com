const commentsSection = document.querySelector('#comments');
const commentsPlaceholder = document.querySelector('#comments-placeholder');
const commentsLoadButton = document.querySelector('#load-comments');
const commentsId = commentsSection.getAttribute('data-comments-id');

commentsLoadButton.addEventListener(
  'click',
  async () => {
    commentsLoadButton.innerHTML = 'Loading...';

    // Don't need this until they reach the comments section
    const { fetchComments, renderComments, CommentsError } = await import('./comments.utils.js');
    try {
      const comments = await fetchComments(commentsId);
      renderComments(comments);
      // Focus first comment
      if (comments.length) {
        commentsPlaceholder.remove();
        commentsSection.querySelector('.post-comment-username').focus();
      }
    } catch (error) {
      // Custom/known error that we threw
      if (error instanceof CommentsError) {
        commentsPlaceholder.innerHTML = error.message;
      } else {
        // This should hopefully never happen
        commentsPlaceholder.innerHTML = 'An unexpected error occurred while fetching comments.';
      }
    }
  },
  { once: true }
);
