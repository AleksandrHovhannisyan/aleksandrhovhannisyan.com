/**
 * Returns all comments from the GitHub issues API using the provided issue ID and repo.
 */
export const fetchComments = async ({ repo, issueId }) => {
  return fetch(`https://api.github.com/repos/${repo}/issues/${issueId}/comments`).then((blob) => blob.json());
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

  // Dynamic imports to reduce the main bundle size.
  const marked = (await import(/* webpackChunkName: "marked" */ 'marked')).default;
  const DOMPurify = (await import(/* webpackChunkName: "dompurify" */ 'dompurify/dist/purify.min.js')).default;
  const dayjs = (await import(/* webpackChunkName: "dayjs" */ 'dayjs')).default;
  const dayjsRelativeTimePlugin = (await import(/* webpackChunkName: "relativeTime" */ 'dayjs/plugin/relativeTime'))
    .default;

  // This allows us to express dates relative to today (e.g., 2 hours ago)
  dayjs.extend(dayjsRelativeTimePlugin);

  commentsCounter.innerText = `(${comments.length})`;

  const commentsList = document.createElement('ol');
  commentsList.className = 'comments-list';

  commentsList.innerHTML = comments
    .sort((comment1, comment2) => {
      return comment1.created_at < comment2.created_at ? 1 : -1;
    })
    .map((comment) => {
      const datePosted = dayjs(comment.created_at).fromNow();
      const user = comment.user;
      const body = DOMPurify.sanitize(marked(comment.body));
      const postedByAuthor = comment.author_association === 'OWNER';
      const edited = comment.created_at !== comment.updated_at;

      return `<li class="post-comment">
                    <header class="post-comment-header">
                        <img src="${user.avatar_url}" alt="" aria-hidden="true" class="post-comment-avatar">
                        <a
                            href="https://github.com/${user.login}"
                            class="post-comment-username"
                            >${user.login}</a
                        >
                        <div class="post-comment-meta">commented
                        <time datetime="${comment.created_at}">${datePosted}</time></div>
                        ${postedByAuthor ? '<span class="post-comment-meta tag post-comment-author">Author</span>' : ''}
                        ${edited ? `<span class="post-comment-meta post-comment-edited">Edited</span>` : ''}
                    </header>
                    <div class="post-comment-body">${body}</div>
                </li>`;
    })
    .join('');

  commentsWrapper.innerHTML = '';
  commentsWrapper.appendChild(commentsList);
};
