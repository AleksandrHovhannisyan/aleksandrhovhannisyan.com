const commentTemplate = document.querySelector(`#comment-template`);

/** Returns all comments using the provided issue ID. */
export const fetchComments = async (id) => {
  const response = await (await fetch(`/.netlify/functions/comments?id=${id}`)).json();
  if (response.error) {
    throw new Error(response.error);
  }
  /** @type import("../../../../types/comments.typedefs").PostComment[] */
  const comments = response.data;
  return comments;
};

/** @param {import("../../../../types/comments.typedefs").PostComment} comment The user comment to render. */
const renderComment = (comment) => {
  const commentNode = commentTemplate.content.cloneNode(true);

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

export const renderComments = async (comments) => {
  const commentSection = document.querySelector('#comments');
  const commentsCounter = commentSection.querySelector('#comments-count');
  const commentsPlaceholder = commentSection.querySelector('#comments-placeholder');
  const commentsList = commentSection.querySelector('ol');

  if (!comments.length) {
    commentsPlaceholder.innerHTML = 'No comments yet.';
    return;
  }

  commentsCounter.innerText = `${comments.length} `;
  commentsPlaceholder.remove();
  comments.forEach((comment) => {
    const commentNode = renderComment(comment);
    commentsList.appendChild(commentNode);
  });
};
