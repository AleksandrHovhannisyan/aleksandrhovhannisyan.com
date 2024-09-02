/** A comment on one of my posts. See api/comments.ts. */
export type PostComment = {
  /** The user who posted the comment. */
  user: {
    /** The URL for the user's profile photo. */
    avatarUrl: string;
    /** The user's username */
    name: string;
    /** Whether the user is me (author of the blog). */
    isAuthor: boolean;
  };
  /** A raw datetime string representing when the comment was created. */
  dateTime: string;
  /** A human-readable string, relative to now, when the comment was created (e.g., `"20 hours ago"`). */
  dateRelative: string;
  /** Whether the comment was edited. */
  isEdited: boolean;
  /** The sanitized comment body, as an HTML string. */
  body: string;
};
