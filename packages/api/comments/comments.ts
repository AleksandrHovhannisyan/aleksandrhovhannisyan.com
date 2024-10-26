import { Octokit } from '@octokit/rest';
import { createTokenAuth } from '@octokit/auth-token';
import { sanitizeHtml, getRelativeTimeString } from 'web/lib/utils.js';
import { markdown } from 'web/lib/plugins/markdown.js';
import site from 'web/src/_data/site.js';
import type { PostComment } from 'web/lib/types.js';

export default {
  /** Returns comments for a given post by ID. https://developers.cloudflare.com/workers/runtime-apis/handlers/
   * @param request The incoming HTTP request.
   * @param env Environment secrets set for this worker.
   */
  async fetch(request: Request, env: Record<string, string>) {
    // Only needed for local dev on Chrome (not Firefox). On prod, the front end makes a request to a worker route on the same origin.
    const headers =
      env.ENVIRONMENT === 'development'
        ? ({
            'Access-Control-Allow-Origin': 'http://localhost:4001',
            'Access-Control-Allow-Methods': 'GET',
            'Access-Control-Allow-Headers': 'Content-Type',
          } satisfies Record<string, string>)
        : {};

    // Handle CORS preflight request
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers,
      });
    }

    // Authenticate with GitHub Issues SDK
    const auth = createTokenAuth(env.GITHUB_PERSONAL_ACCESS_TOKEN);
    const { token } = await auth();
    const octokit = new Octokit({ auth: token });

    const commentsId = new URL(request.url).searchParams.get('id');
    if (!commentsId) {
      return new Response(JSON.stringify({ error: 'You must specify an issue ID.' }), { status: 400, headers });
    }

    try {
      // Check this first. Does not count towards the API rate limit.
      const { data: rateLimitInfo } = await octokit.rateLimit.get();
      const remainingRequests = rateLimitInfo.rate.remaining;
      console.log(`GitHub API requests remaining: ${remainingRequests}`);
      if (remainingRequests === 0) {
        const resetDate = new Date(0);
        // From the docs: "The time at which the current rate limit window resets in UTC epoch seconds."
        resetDate.setUTCSeconds(rateLimitInfo.rate.reset);
        const retryTimeRelative = getRelativeTimeString(resetDate);
        const retryTimeSeconds = Math.floor((resetDate.getTime() - Date.now()) / 1000);
        return new Response(JSON.stringify({ error: `API rate limit exceeded. Try again ${retryTimeRelative}.` }), {
          status: 503,
          headers: { ...headers, 'Retry-After': retryTimeSeconds.toString() },
        });
      }

      // Reference for pagination: https://michaelheap.com/octokit-pagination/
      // Fetching issue comments for a repo: https://docs.github.com/en/rest/reference/issues#list-issue-comments-for-a-repository
      const response = await octokit.paginate<typeof octokit.issues.listComments, PostComment[]>(
        octokit.issues.listComments,
        {
          owner: site.repo.owner,
          repo: site.repo.name,
          issue_number: parseInt(commentsId, 10),
          sort: 'created_at',
          direction: 'desc',
          per_page: 100, // this is the max number of results per page that the API supports
        },
        (response) =>
          response.data.map((comment) => ({
            user: {
              avatarUrl: comment.user!.avatar_url,
              // Sanitize usernames to prevent XSS
              name: sanitizeHtml(comment.user!.login),
              isAuthor: comment.author_association === 'OWNER',
            },
            dateTime: comment.created_at,
            dateRelative: getRelativeTimeString(comment.created_at),
            isEdited: comment.created_at !== comment.updated_at,
            // Sanitize comment body to prevent XSS
            body: sanitizeHtml(markdown.render(comment.body ?? '')),
          }))
      );

      return new Response(JSON.stringify({ data: response }), { status: 200, headers });
    } catch (e) {
      console.log(e);
      return new Response(JSON.stringify({ error: 'Unable to fetch comments for this post.' }), {
        status: 500,
        headers,
      });
    }
  },
};
