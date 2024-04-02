const { Octokit } = require('@octokit/rest');
const { createTokenAuth } = require('@octokit/auth-token');
const { sanitizeHtml } = require('../config/utils');
const { markdown } = require('../config/plugins/markdown');
const site = require('../src/_data/site');
const dayjs = require('dayjs');
const dayjsRelativeTimePlugin = require('dayjs/plugin/relativeTime');
dayjs.extend(dayjsRelativeTimePlugin);

/** Returns an authenticated GitHub API instance that can be used to fetch data. */
const getAuthenticatedOctokit = async () => {
  const auth = createTokenAuth(process.env.GITHUB_PERSONAL_ACCESS_TOKEN);
  const { token } = await auth();
  return new Octokit({ auth: token });
};

// Netlify handler for serverless function. Returns comments for a given post by ID.
exports.handler = async (event) => {
  const issueNumber = event.queryStringParameters.id;
  const Octokit = await getAuthenticatedOctokit();

  try {
    // Check this first. Does not count towards the API rate limit.
    const { data: rateLimitInfo } = await Octokit.rateLimit.get();
    console.log(`GitHub API requests remaining: ${rateLimitInfo.rate.remaining}`);
    if (rateLimitInfo.rate.remaining === 0) {
      const retryAfterSeconds = rateLimitInfo.rate.reset - Math.floor(Date.now() / 1000);
      return {
        statusCode: 503,
        headers: {
          'Retry-After': retryAfterSeconds,
        },
        body: JSON.stringify({ error: 'Hourly API rate limit exceeded.' }),
      };
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

    return {
      statusCode: 200,
      body: JSON.stringify({ data: comments }),
    };
  } catch (e) {
    console.log(e);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Unable to fetch comments for this post.' }),
    };
  }
};
