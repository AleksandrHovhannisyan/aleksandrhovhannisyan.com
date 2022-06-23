/** Returns all comments using the provided issue ID. */
export const fetchComments = async (id) => {
  const response = await fetch(`/.netlify/functions/comments?id=${id}`);
  const { data: comments, error } = await response.json();
  if (error) {
    throw new Error(error);
  }
  return comments;
};

/** Renders the given list of comments, converting markdown to HTML. */
export const renderComments = async (comments) => {
  const commentsSection = document.querySelector('#comments');
  const commentsWrapper = commentsSection.querySelector('#comments-wrapper');
  const commentsCounter = commentsSection.querySelector('#comments-count');
  const commentsPlaceholder = commentsSection.querySelector('#comments-placeholder');

  if (comments.length === 0) {
    commentsPlaceholder.innerHTML = `No comments yet.`;
    return;
  }
  commentsCounter.innerText = `(${comments.length})`;

  const commentsList = document.createElement('ol');
  commentsList.className = 'stack gap-10';
  commentsList.innerHTML = comments
    .map((comment) => {
      return `<li>
                <article class="post-comment stack gap--2">
                  <header class="flex align-center flex-wrap gap--2 relative">
                    <img src="${comment.user.avatarUrl}" alt="" aria-hidden="true" class="post-comment-avatar circle">
                    <a
                      href="https://github.com/${comment.user.name}"
                      class="heading"
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      ${comment.user.name}
                    </a>
                    <div class="fs-sm">commented
                    <time datetime="${comment.created_at}">${comment.datePosted}</time></div>
                    ${
                      comment.isAuthor
                        ? '<span class="pill post-comment-author" data-shape="round" data-size="xs">Author</span>'
                        : ''
                    }
                    ${comment.isEdited ? `<span class="fs-sm post-comment-edited">Edited</span>` : ''}
                  </header>
                  <div class="post-comment-body rhythm">${comment.body}</div>
                </article>
              </li>`;
    })
    .join('');

  commentsWrapper.innerHTML = '';
  commentsWrapper.appendChild(commentsList);
};
