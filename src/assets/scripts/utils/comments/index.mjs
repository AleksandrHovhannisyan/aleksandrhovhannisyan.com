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
  commentsList.className = 'comments-list';
  commentsList.innerHTML = comments
    .map((comment) => {
      return `<li>
                <article class="post-comment">
                  <header class="post-comment-header">
                    <img src="${comment.user.avatarUrl}" alt="" aria-hidden="true" class="post-comment-avatar circle">
                    <a
                      href="https://github.com/${comment.user.name}"
                      class="post-comment-username"
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      ${comment.user.name}
                    </a>
                    <div class="font-sm">commented
                    <time datetime="${comment.created_at}">${comment.datePosted}</time></div>
                    ${
                      comment.isAuthor
                        ? '<span class="pill post-comment-author" data-shape="round" data-size="xs">Author</span>'
                        : ''
                    }
                    ${comment.isEdited ? `<span class="font-sm post-comment-edited">Edited</span>` : ''}
                  </header>
                  <div class="post-comment-body">${comment.body}</div>
                  <ul class="post-comment-reactions" aria-label="Reactions">
                    ${Object.entries(comment.reactions).map(
                      ([id, reaction]) =>
                        `<li>
                          <span class="post-comment-reaction-count">${reaction.count}</span>&nbsp;
                          <span class="screen-reader-only">${id}</span>
                          <span aria-hidden="true">${reaction.emoji}</span>
                        </li>`
                    )}
                  </ul>
                </article>
              </li>`;
    })
    .join('');

  commentsWrapper.innerHTML = '';
  commentsWrapper.appendChild(commentsList);
};
