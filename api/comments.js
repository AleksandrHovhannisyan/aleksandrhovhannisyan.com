const { getAuthenticatedOctokit, sanitizeHtml } = require('../config/utils');
const dayjs = require('dayjs');
const markdownLib = require('../config/plugins/markdown');
const dayjsRelativeTimePlugin = require('dayjs/plugin/relativeTime');
const site = require('../src/_data/site');

dayjs.extend(dayjsRelativeTimePlugin);

exports.handler = async (event) => {
  const issueNumber = event.queryStringParameters.id;
  const Octokit = await getAuthenticatedOctokit();

  try {
    // Check this first. Does not count towards the API rate limit.
    const { data: rateLimitInfo } = await Octokit.rateLimit.get();
    console.log(`GitHub API requests remaining: ${rateLimitInfo.resources.core.remaining}`);
    if (rateLimitInfo.resources.core.remaining === 0) {
      return {
        statusCode: 429,
        body: JSON.stringify({ error: 'Unable to fetch comments at this time. Check back later.' }),
      };
    }

    // https://docs.github.com/en/rest/reference/issues#list-issue-comments-for-a-repository
    const response = await Octokit.issues.listComments({
      owner: site.issues.owner,
      repo: site.issues.repo,
      issue_number: issueNumber,
    });

    if (response.status !== 200) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: `Unable to fetch comments for this post.` }),
      };
    }

    const comments = response.data
      // Recent comments first
      .sort((comment1, comment2) => comment2.created_at.localeCompare(comment1.created_at))
      // Restructure the data so the client-side JS doesn't have to do this
      .map((comment) => {
        return {
          user: {
            avatarUrl: comment.user.avatar_url,
            name: comment.user.login,
          },
          datePosted: dayjs(comment.created_at).fromNow(),
          isEdited: comment.created_at !== comment.updated_at,
          isAuthor: comment.author_association === 'OWNER',
          body: sanitizeHtml(markdownLib.render(comment.body)),
        };
      });

    return {
      statusCode: response.status,
      body: JSON.stringify({
        data: comments,
      }),
    };
  } catch (e) {
    console.log(e);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Unable to fetch comments for this post.' }),
    };
  }
};
