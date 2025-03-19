import type { PostComment } from '../../../lib/types';

/** Represents an error that occurred while fetching or rendering comments. */
export class CommentsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CommentsError';
  }
}

/** Returns all comments using the provided issue ID.
 * @param id The ID of the comments source (e.g., GitHub issue number if using GitHub Issues API).
 * @throws {CommentsError}
 */
export const fetchComments = async (id: string) => {
  try {
    const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:4002' : '';
    const response = await (await fetch(`${baseUrl}/api/comments?id=${id}`)).json();
    if (response.error) {
      throw new CommentsError(response.error);
    }
    /** @type import("../../../lib/types").PostComment[] */
    const comments: import('../../../lib/types').PostComment[] = response.data;
    return comments;
  } catch (e) {
    // Allow custom error to bubble to caller
    if (e instanceof CommentsError) {
      throw e;
    }
    throw new CommentsError('Unable to fetch comments.');
  }
};

const COMMENT_TEMPLATE = document.querySelector<HTMLTemplateElement>(`#comment-template`)!;
let authorComment = 0;

/** @param comment The user comment to render. */
const renderComment = (comment: PostComment) => {
  const commentNode = COMMENT_TEMPLATE.content.cloneNode(true) as HTMLElement;

  const userAvatar = commentNode.querySelector<HTMLImageElement>('img');
  if (userAvatar) {
    userAvatar.src = `${comment.user.avatarUrl}`;
    userAvatar.removeAttribute('eleventy:ignore');
  }

  const userLink = commentNode.querySelector<HTMLAnchorElement>('a');
  if (userLink) {
    userLink.href = `https://github.com/${comment.user.name}`;
    userLink.innerHTML = comment.user.name;
  }

  const authorPill = commentNode.querySelector('.post-comment-author');
  if (authorPill) {
    if (!comment.user.isAuthor) {
      authorPill.remove();
    } else {
      const authorPillId = `author-${authorComment++}`;
      authorPill.id = authorPillId;
      userLink?.setAttribute('aria-describedby', authorPillId);
    }
  }

  const commentTimestamp = commentNode.querySelector('time');
  if (commentTimestamp) {
    commentTimestamp.setAttribute('datetime', comment.dateTime);
    commentTimestamp.innerHTML = comment.dateRelative;
  }

  const editedPill = commentNode.querySelector('.post-comment-edited');
  if (editedPill && !comment.isEdited) {
    editedPill.remove();
  }

  const commentBody = commentNode.querySelector('.post-comment-body');
  if (commentBody) {
    commentBody.innerHTML = comment.body;
  }

  return commentNode;
};

/** @param comments The user comments to render. */
export const renderComments = (comments: PostComment[]) => {
  if (!comments.length) {
    throw new CommentsError('No comments yet.');
  }
  const commentSection = document.querySelector<HTMLElement>('#comments');
  const counter = commentSection?.querySelector<HTMLElement>('#comments-count');
  const list = document.createElement('ol');
  list.classList.add('rhythm');
  list.style.setProperty('--rhythm', '2lh');
  if (counter) {
    counter.innerText = comments.length + ' ';
  }
  // https://frontendmasters.com/blog/patterns-for-memory-efficient-dom-manipulation/#approach-2-use-createdocumentfragment-with-appendchild-to-batch-inserts
  const fragment = document.createDocumentFragment();
  comments.forEach((comment) => {
    const commentNode = renderComment(comment);
    // append to in-memory fragment `n` times...
    fragment.appendChild(commentNode);
  });
  // ... but append to actual list once at the end, to avoid unnecessary reflow from `n` appends
  list.appendChild(fragment);
  commentSection?.appendChild(list);
};
