import { Octokit } from '@octokit/rest';
import { createTokenAuth } from '@octokit/auth-token';
import { sanitizeHtml, getRelativeTimeString } from 'web/lib/utils.js';
import { makeMarkdownParser } from 'web/lib/plugins/markdown.js';
import site from 'web/src/_data/site.js';
import type { PostComment, PostCommentResponse } from 'web/lib/types.js';

const markdown = makeMarkdownParser({ isTrustedInput: false });

export default {
  /** Returns comments for a given post by ID. https://developers.cloudflare.com/workers/runtime-apis/handlers/
   * @param request The incoming HTTP request.
   * @param env Environment secrets set for this worker.
   */
  async fetch(request: Request, env: Record<string, string>) {
    // Authenticate with GitHub Issues SDK
    const auth = createTokenAuth(env.GITHUB_PERSONAL_ACCESS_TOKEN);
    const { token } = await auth();
    const octokit = new Octokit({ auth: token });

    const commentsId = parseInt(new URL(request.url).searchParams.get('id'), 10);
    if (Number.isNaN(commentsId)) {
      return new Response(JSON.stringify({ error: 'Invalid ID.' } satisfies PostCommentResponse), { status: 400 });
    }

    try {
      /** The number of API requests remaining. */
      let rateLimitRemaining = Infinity;
      /** The time at which the current rate limit window resets in UTC epoch seconds */
      let rateLimitResetSeconds = -1;

      // Reference for pagination: https://michaelheap.com/octokit-pagination/
      // Fetching issue comments for a repo: https://docs.github.com/en/rest/reference/issues#list-issue-comments-for-a-repository
      const comments = await octokit.paginate<typeof octokit.issues.listComments, PostComment[]>(
        octokit.issues.listComments,
        {
          owner: site.repo.owner,
          repo: site.repo.name,
          issue_number: commentsId,
          sort: 'created_at',
          direction: 'desc',
          per_page: 100, // this is the max number of results per page that the API supports
        },
        (response, abort) => {
          rateLimitRemaining = parseInt(response.headers['x-ratelimit-remaining'], 10);
          rateLimitResetSeconds = parseInt(response.headers['x-ratelimit-reset'], 10);
          console.log({ rateLimitRemaining, rateLimitResetSeconds });
          if (!rateLimitRemaining) {
            abort();
          }

          return response.data.map(
            (comment) =>
              ({
                user: {
                  avatarUrl: comment.user!.avatar_url,
                  url: comment.user!.html_url,
                  // Sanitize usernames to prevent XSS
                  name: sanitizeHtml(comment.user!.login),
                  isAuthor: comment.author_association === 'OWNER',
                },
                // TODO: rename to date
                dateTime: comment.created_at,
                // TODO: do this on client side
                dateRelative: getRelativeTimeString(comment.created_at),
                isEdited: comment.created_at !== comment.updated_at,
                // Sanitize comment body to prevent XSS
                body: sanitizeHtml(markdown.render(comment.body ?? '')).trim(),
              }) satisfies PostComment
          );
        }
      );

      if (!rateLimitRemaining) {
        const resetDate = new Date(0);
        resetDate.setUTCSeconds(rateLimitResetSeconds);
        const retryTimeRelative = getRelativeTimeString(resetDate);
        const retryTimeSeconds = Math.floor((resetDate.getTime() - Date.now()) / 1000);

        return new Response(
          JSON.stringify({
            error: `API rate limit exceeded. Try again ${retryTimeRelative}.`,
          } satisfies PostCommentResponse),
          {
            status: 503,
            headers: { 'Retry-After': retryTimeSeconds.toString() },
          }
        );
      }

      return new Response(JSON.stringify({ data: comments } satisfies PostCommentResponse), { status: 200 });
    } catch (e) {
      console.log(e);
      return new Response(
        JSON.stringify({ error: 'Unable to fetch comments for this post.' } satisfies PostCommentResponse),
        {
          status: 500,
        }
      );
    }
  },
};
