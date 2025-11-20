export type MaybeError<Success, Error> =
  | {
      /** The data to return if no errors were encountered. */
      data: Success;
    }
  | {
      /** A description of what went wrong. */
      error: Error;
    };

/** A comment on one of my posts. See api/comments.ts. */
export type PostComment = {
  /** The user who posted the comment. */
  user: {
    /** The URL for the user's profile photo. */
    avatarUrl: string;
    /** The URL for the user's profile. */
    url: string;
    /** The user's username. Must be sanitized on the back end. */
    name: string;
    /** Whether the user is me (author of the blog). */
    isAuthor?: boolean;
  };
  /** A raw datetime string representing when the comment was created. */
  date: string;
  /** Whether the comment was edited. */
  isEdited?: boolean;
  /** The sanitized comment body, as an HTML string. */
  body: string;
};

export type PostCommentResponse = MaybeError<PostComment, string>;
