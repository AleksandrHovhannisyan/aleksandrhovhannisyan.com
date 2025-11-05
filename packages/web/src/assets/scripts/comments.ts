const commentsSection = document.querySelector('#comments');
const commentsPlaceholder = document.querySelector('#comments-placeholder');
const commentsLoadButton = commentsSection?.querySelector('button');
const commentsId = commentsSection?.getAttribute('data-comments-id');

if (commentsSection && commentsPlaceholder && commentsLoadButton && commentsId) {
  commentsLoadButton.addEventListener(
    'click',
    async () => {
      const { fetchComments, renderComments, CommentsError } = await import('./comments.utils.js');
      commentsLoadButton.innerHTML = 'Loading...';

      // Don't need this until they reach the comments section
      try {
        const comments = await fetchComments(commentsId);
        const commentsRoot = renderComments(comments);

        if (comments.length) {
          commentsPlaceholder.remove();
          // Focus first comment, for keyboard users
          commentsRoot.querySelector('a').focus();
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
}
