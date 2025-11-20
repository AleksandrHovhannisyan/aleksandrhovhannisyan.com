import type { PostComment, PostCommentResponse } from '../../../lib/types.js';
import { getRelativeTimeString } from '../../../lib/utils/date.js';
import { parseStream } from './utils.js';

class CommentAPIError extends Error {
  constructor(message: string) {
    super(message);
  }
}

/**
 * Generator that yields one parsed JSON object at a time. Each object represents a post comment on my blog.
 * @throws {CommentAPIError}
 */
async function* fetchComments(issueNumber: string) {
  const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:4002' : '';
  const response = await fetch(`${baseUrl}/api/comments?id=${issueNumber}`);

  // For non-200 responses, my API sends a Response body with an object of the shape `{ error: string }`
  if (!response.ok) {
    throw new CommentAPIError((await response.json()).error);
  }

  for await (const chunk of parseStream<PostCommentResponse>(response)) {
    // Error mid-stream (e.g., due to rate limiting or some other problem)
    if ('error' in chunk) {
      throw new CommentAPIError(chunk.error);
    }
    yield chunk.data;
  }
}

/**
 * @param template An HTML template element that defines the markup for a comment.
 * @param comment The user comment to render.
 */
function renderComment(template: HTMLTemplateElement, comment: PostComment) {
  const commentNode = template.content.cloneNode(true) as HTMLElement;

  const userAvatar = commentNode.querySelector<HTMLImageElement>('img');
  if (userAvatar) {
    userAvatar.src = comment.user.avatarUrl;
  }

  const userLink = commentNode.querySelector<HTMLAnchorElement>('a');
  if (userLink) {
    userLink.href = comment.user.url;
    userLink.innerHTML = comment.user.name;
  }

  const authorPill = commentNode.querySelector('.post-comment-author');
  if (authorPill) {
    if (!comment.user.isAuthor) {
      authorPill.remove();
    } else {
      const authorPillId = `author-${crypto.randomUUID()}`;
      authorPill.id = authorPillId;
      userLink?.setAttribute('aria-describedby', authorPillId);
    }
  }

  const commentTimestamp = commentNode.querySelector('time');
  if (commentTimestamp) {
    commentTimestamp.setAttribute('datetime', comment.date);
    commentTimestamp.innerHTML = getRelativeTimeString(comment.date);
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
}

const commentSection = document.querySelector('#comments');
const commentListPlaceholder = document.querySelector('#comments-placeholder');
const commentLoadButton = commentSection?.querySelector('button');
const issueNumber = commentSection?.getAttribute('data-comments-id');

if (commentSection && commentListPlaceholder && commentLoadButton && issueNumber) {
  commentLoadButton.addEventListener(
    'click',
    async () => {
      commentLoadButton.innerHTML = 'Loading&hellip;';

      const commentList = document.createElement('ol');
      commentList.classList.add('rhythm');
      commentList.style.setProperty('--rhythm', '2lh');

      const commentTemplate = document.querySelector<HTMLTemplateElement>(`#comment-template`)!;
      let commentCount = 0;

      try {
        // Render each comment as it's streamed from the server
        for await (const comment of fetchComments(issueNumber)) {
          const commentNode = renderComment(commentTemplate, comment);
          commentList.appendChild(commentNode);

          if (!commentCount++) {
            commentListPlaceholder.parentElement.insertBefore(commentList, commentListPlaceholder);
          }
        }

        // Done. Check if we rendered any comments.
        if (commentCount) {
          const commentCountLabel = commentSection.querySelector<HTMLElement>('#comments-count');
          commentCountLabel.innerText = commentCount.toString();
          commentList.querySelector('a').focus();
          commentListPlaceholder.remove();
        } else {
          commentListPlaceholder.innerHTML = 'No comments yet.';
        }
      } catch (error) {
        console.log(error);
        // Recognized (internal) error
        if (error instanceof CommentAPIError) {
          commentListPlaceholder.innerHTML = String(error);
        } else {
          // Unknown error. This should hopefully never happen.
          commentListPlaceholder.innerHTML = 'An unknown error occurred while fetching comments.';
        }
      }
    },
    // Prevent re-click (cleaner pattern than disabling the button)
    { once: true }
  );
}
