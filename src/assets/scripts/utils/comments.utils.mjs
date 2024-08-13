/** Represents an error that occurred while fetching or rendering comments. */
export class CommentsError extends Error {
  /**
   * @param {string} message
   */
  constructor(message) {
    super(message);
    this.name = 'CommentsError';
  }
}

/** Returns all comments using the provided issue ID.
 * @param {string} id The ID of the comments source (e.g., GitHub issue number if using GitHub Issues API).
 * @throws {CommentsError}
 */
export const fetchComments = async (id) => {
  try {
    const response = await (await fetch(`/.netlify/functions/comments?id=${id}`)).json();
    if (response.error) {
      throw new CommentsError(response.error);
    }
    /** @type import("../../../../types/comments.typedefs").PostComment[] */
    const comments = response.data;
    return comments;
  } catch (e) {
    // Allow custom error to bubble to caller
    if (e instanceof CommentsError) {
      throw e;
    }
    throw new CommentsError('Unable to fetch comments.');
  }
};

const COMMENT_TEMPLATE = document.querySelector(`#comment-template`);

/** @param {import("../../../../types/comments.typedefs").PostComment} comment The user comment to render. */
const renderComment = (comment) => {
  const commentNode = COMMENT_TEMPLATE.content.cloneNode(true);

  const userAvatar = commentNode.querySelector('img');
  const userLink = commentNode.querySelector('a');
  userAvatar.src = `${comment.user.avatarUrl}`;
  userLink.href = `https://github.com/${comment.user.name}`;
  userLink.innerHTML = comment.user.name;

  const authorPill = commentNode.querySelector('.post-comment-author');
  if (!comment.user.isAuthor) {
    authorPill.remove();
  } else {
    const authorPillId = `author-${comment.user.name.replace(/\s/, '')}`;
    authorPill.id = authorPillId;
    userLink.setAttribute('aria-describedby', authorPillId);
  }

  const commentTimestamp = commentNode.querySelector('time');
  commentTimestamp.setAttribute('datetime', comment.dateTime);
  commentTimestamp.innerHTML = comment.dateRelative;

  const editedPill = commentNode.querySelector('.post-comment-edited');
  if (!comment.isEdited) {
    editedPill.remove();
  }

  const commentBody = commentNode.querySelector('.post-comment-body');
  commentBody.innerHTML = comment.body;

  return commentNode;
};

/** @param {import("../../../../types/comments.typedefs").PostComment[]} comments The user comments to render. */
export const renderComments = (comments) => {
  if (!comments.length) {
    throw new CommentsError('No comments yet.');
  }
  const commentSection = document.querySelector('#comments');
  const commentsCounter = commentSection.querySelector('#comments-count');
  const commentsPlaceholder = commentSection.querySelector('#comments-placeholder');
  const commentsList = commentSection.querySelector('ol');
  commentsCounter.innerText = `${comments.length} `;
  commentsPlaceholder.remove();
  comments.forEach((comment) => {
    const commentNode = renderComment(comment);
    commentsList.appendChild(commentNode);
  });
};
