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

  if (!comments.length) {
    commentsPlaceholder.innerHTML = `No comments yet.`;
    return;
  }

  commentsCounter.innerText = `${comments.length} `;
  const commentsList = document.createElement('ol');
  commentsList.className = 'stack gap-10';
  commentsList.innerHTML = comments
    .map((comment, i) => {
      const { user, isEdited, created_at, datePosted, body } = comment;
      const authorPillId = `author-${i}`;
      return `<li>
                <article class="post-comment stack gap-0">
                  <header class="post-comment-meta">
                    <img src="${user.avatarUrl}" alt="" aria-hidden="true" class="post-comment-avatar circle">
                    <a
                      href="https://github.com/${user.name}"
                      class="post-comment-username"
                      target="_blank"
                      rel="noreferrer noopener"
                      ${user.isAuthor ? `aria-describedby="${authorPillId}"` : ''}
                    >
                      ${user.name}
                    </a>
                    <span class="fs-sm">
                      commented <time datetime="${created_at}">${datePosted}</time>
                    </span>
                    ${
                      user.isAuthor
                        ? `<span id="${authorPillId}" class="pill post-comment-author" data-shape="round" data-size="xs">Author</span>`
                        : ''
                    }
                    ${isEdited ? `<span class="fs-sm post-comment-edited">Edited</span>` : ''}
                  </header>
                  <div class="post-comment-body rhythm">${body}</div>
                </article>
              </li>`;
    })
    .join('');

  commentsWrapper.innerHTML = '';
  commentsWrapper.appendChild(commentsList);
};
