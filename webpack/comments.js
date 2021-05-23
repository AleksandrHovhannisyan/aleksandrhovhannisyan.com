const commentsSection = document.getElementById('comments');
const commentsWrapper = commentsSection.querySelector('#comments-wrapper');
const commentsCounter = commentsSection.querySelector('#comments-count');
const commentsIssueId = commentsSection.getAttribute('data-comments-id');

// Optimization: Defer GitHub API request until users reach the comments footer.
const commentsObserver = new IntersectionObserver(
  (entries, self) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        fetchComments();
        self.unobserve(entry.target);
      }
    });
  },
  { rootMargin: '200px 0px 0px 0px' }
);
commentsObserver.observe(commentsSection);

/**
 * Fetches all comments from the GitHub issues API, using the issue ID injected via a post's front matter.
 * See _layouts/post.html for how this gets set as a data- attribute.
 */
const fetchComments = () => {
  fetch(
    `https://api.github.com/repos/AleksandrHovhannisyan/aleksandrhovhannisyan.com/issues/${commentsIssueId}/comments`
  )
    .then((blob) => blob.json())
    .then(renderComments)
    .catch(() => {
      commentsWrapper.innerHTML = `<p>Unable to retrieve the comments for this post. Check back later.</p>`;
    });
};

/** Renders the given list of comments, converting markdown to HTML. */
const renderComments = async (comments) => {
  // Dynamic imports reduce the main bundle size.
  // These only get loaded when the user scrolls to the comments section.

  const marked = (await import(/* webpackChunkName: "marked" */ 'marked')).default;
  const DOMPurify = (await import(/* webpackChunkName: "dompurify" */ 'dompurify')).default;
  const dayjs = (await import(/* webpackChunkName: "dayjs" */ 'dayjs')).default;
  const dayjsRelativeTimePlugin = (await import(/* webpackChunkName: "relativeTime" */ 'dayjs/plugin/relativeTime'))
    .default;

  // This allows us to express dates relative to today (e.g., 2 hours ago)
  dayjs.extend(dayjsRelativeTimePlugin);

  commentsCounter.innerText = `(${comments.length})`;

  const commentsList = document.createElement('ol');
  commentsList.className = 'comments-list';
  commentsList.setAttribute('aria-label', 'Comments on this blog post');

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
