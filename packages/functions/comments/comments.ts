import { Octokit } from '@octokit/rest';
import { createTokenAuth } from '@octokit/auth-token';
import { sanitizeHtml } from 'web/lib/utils.js';
import { markdown } from 'web/lib/plugins/markdown.js';
import site from 'web/src/_data/site.js';
import dayjs from 'dayjs';
import dayjsRelativeTimePlugin from 'dayjs/plugin/relativeTime.js';
import type { PostComment } from 'web/lib/types/comments.js';
dayjs.extend(dayjsRelativeTimePlugin);

export default {
  /** Handler for serverless function. Returns comments for a given post by ID. https://developers.cloudflare.com/workers/runtime-apis/handlers/
   * @param request The incoming HTTP request.
   * @param env Environment secrets set for this worker.
   */
  async fetch(request: Request, env: Record<string, string>) {
    // Authenticate with GitHub Issues SDK
    const auth = createTokenAuth(env.GITHUB_PERSONAL_ACCESS_TOKEN);
    const { token } = await auth();
    const octokit = new Octokit({ auth: token });

    const commentsId = new URL(request.url).searchParams.get('id');
    if (!commentsId) {
      return new Response(JSON.stringify({ error: 'You must specify an issue ID.' }), { status: 400 });
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
        const retryTimeRelative = dayjs(resetDate).fromNow();
        const retryTimeSeconds = Math.floor((resetDate.getTime() - Date.now()) / 1000);
        return new Response(JSON.stringify({ error: `API rate limit exceeded. Try again ${retryTimeRelative}.` }), {
          status: 503,
          headers: { 'Retry-After': retryTimeSeconds.toString() },
        });
      }

      // Reference for pagination: https://michaelheap.com/octokit-pagination/
      // Fetching issue comments for a repo: https://docs.github.com/en/rest/reference/issues#list-issue-comments-for-a-repository
      const response = await octokit.paginate<typeof octokit.issues.listComments, PostComment[]>(
        octokit.issues.listComments,
        {
          owner: site.issues.owner,
          repo: site.issues.repo,
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
            dateRelative: dayjs(comment.created_at).fromNow(),
            isEdited: comment.created_at !== comment.updated_at,
            // Sanitize comment body to prevent XSS
            body: sanitizeHtml(markdown.render(comment.body ?? '')),
          }))
      );

      return new Response(JSON.stringify({ data: response }), { status: 200 });
    } catch (e) {
      console.log(e);
      return new Response(JSON.stringify({ error: 'Unable to fetch comments for this post.' }), { status: 500 });
    }
  },
};
