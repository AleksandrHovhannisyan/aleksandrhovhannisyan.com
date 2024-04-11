import { Octokit } from '@octokit/rest';
import { createTokenAuth } from '@octokit/auth-token';
import { sanitizeHtml } from '../config/utils.js';
import { markdown } from '../config/plugins/markdown.js';
import site from '../src/_data/site.js';
import dayjs from 'dayjs';
import dayjsRelativeTimePlugin from 'dayjs/plugin/relativeTime.js';
dayjs.extend(dayjsRelativeTimePlugin);

/** Returns an authenticated GitHub API instance that can be used to fetch data. */
const getAuthenticatedOctokit = async () => {
  const auth = createTokenAuth(process.env.GITHUB_PERSONAL_ACCESS_TOKEN);
  const { token } = await auth();
  return new Octokit({ auth: token });
};

/** Netlify handler for serverless function. Returns comments for a given post by ID.
 * @param {Request} request The incoming request data.
 */
export default async function getCommentsForPost(request) {
  const issueNumber = new URL(request.url).searchParams.get('id');
  const Octokit = await getAuthenticatedOctokit();

  try {
    // Check this first. Does not count towards the API rate limit.
    const { data: rateLimitInfo } = await Octokit.rateLimit.get();
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
        headers: { 'Retry-After': retryTimeSeconds },
      });
    }

    // Reference for pagination: https://michaelheap.com/octokit-pagination/
    // Fetching issue comments for a repo: https://docs.github.com/en/rest/reference/issues#list-issue-comments-for-a-repository
    const response = await Octokit.paginate(
      Octokit.issues.listComments,
      {
        owner: site.issues.owner,
        repo: site.issues.repo,
        issue_number: issueNumber,
        per_page: 100, // this is the max number of results per page that the API supports
      },
      (response) => response.data
    );

    /** @type import("../types/comments.typedefs").PostComment[] */
    const comments = response
      // Show comments in chronological order (oldest comments first) so it's easier to read them top-down
      .sort((comment1, comment2) => comment1.created_at.localeCompare(comment2.created_at))
      // Restructure the data so the client-side JS doesn't have to do this
      .map((comment) => {
        return {
          user: {
            avatarUrl: comment.user.avatar_url,
            // Sanitize usernames to prevent XSS
            name: sanitizeHtml(comment.user.login),
            isAuthor: comment.author_association === 'OWNER',
          },
          dateTime: comment.created_at,
          dateRelative: dayjs(comment.created_at).fromNow(),
          isEdited: comment.created_at !== comment.updated_at,
          // Sanitize comment body to prevent XSS
          body: sanitizeHtml(markdown.render(comment.body)),
        };
      });

    return new Response(JSON.stringify({ data: comments }), { status: 200 });
  } catch (e) {
    console.log(e);
    return new Response(JSON.stringify({ error: 'Unable to fetch comments for this post.' }), { status: 500 });
  }
}
