/** Returns all comments using the provided issue ID. */
export const fetchComments = async (id) => {
  return (await fetch(`/.netlify/functions/comments?id=${id}`)).json();
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
      return `<li class="post-comment">
                    <header class="post-comment-header">
                        <img src="${comment.user.avatarUrl}" alt="" aria-hidden="true" class="post-comment-avatar">
                        <a
                            href="https://github.com/${comment.user.name}"
                            class="post-comment-username"
                            >${comment.user.name}</a
                        >
                        <div class="post-comment-meta">commented
                        <time datetime="${comment.created_at}">${comment.datePosted}</time></div>
                        ${
                          comment.isAuthor
                            ? '<span class="post-comment-meta tag post-comment-author">Author</span>'
                            : ''
                        }
                        ${comment.isEdited ? `<span class="post-comment-meta post-comment-edited">Edited</span>` : ''}
                    </header>
                    <div class="post-comment-body">${comment.body}</div>
                </li>`;
    })
    .join('');

  commentsWrapper.innerHTML = '';
  commentsWrapper.appendChild(commentsList);
};
