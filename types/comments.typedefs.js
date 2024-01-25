/**
 * @typedef PostCommentUser
 * @property {string} avatarUrl The remote URL for the commenter's avatar/profile image.
 * @property {string} name The username of the commenter.
 * @property {boolean} isAuthor Whether I'm the commenter. Used to mark my comments differently.
 */

/**
 * @typedef PostComment
 * @property {PostCommentUser} user Information about the user who posted this comment.
 * @property {string} dateTime The raw datetime when this comment was created (for use in a `<time>`'s `dateTime` attribute).
 * @property {string} dateRelative A human-readable description of when this comment was created relative to now (e.g., `"2 hours ago"`).
 * @property {boolean} isEdited Whether this comment was edited.
 * @property {string} body The sanitized HTML body of the comment.
 */

module.exports = {};
