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

  if (comments.length === 0) {
    commentsWrapper.innerHTML = 'No comments yet 👀 Be the first to post!';
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

      return `<li class="comment">
                    <header class="comment-header">
                        <img src="${user.avatar_url}" alt="" aria-hidden="true" class="comment-avatar">
                        <a
                            href="https://github.com/${user.login}"
                            class="comment-meta comment-username"
                            >${user.login}</a
                        >
                        <div class="comment-meta comment-date-posted">commented&nbsp;
                        <time datetime="${comment.created_at}">${datePosted}</time></div>
                        ${postedByAuthor ? '<span class="comment-meta tag comment-author-badge">Author</span>' : ''}
                        ${edited ? `<span class="comment-meta comment-edited">Edited</span>` : ''}
                    </header>
                    <div class="comment-body">${body}</div>
                </li>`;
    })
    .join('');

  commentsWrapper.innerHTML = '';
  commentsWrapper.appendChild(commentsList);
};
