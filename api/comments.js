const { getAuthenticatedOctokit } = require('../config/utils');
const sanitizeHtml = require('sanitize-html');
const dayjs = require('dayjs');
const markdownLib = require('../config/plugins/markdown');
const dayjsRelativeTimePlugin = require('dayjs/plugin/relativeTime');
const site = require('../src/_data/site');

dayjs.extend(dayjsRelativeTimePlugin);

const handler = async (event) => {
  const issueNumber = event.queryStringParameters.id;

  try {
    const Octokit = await getAuthenticatedOctokit();

    // Always check this first
    const { data: rateLimit } = await Octokit.rateLimit.get();
    if (rateLimit.rate.remaining === 0) {
      throw new Error();
    }

    const response = await Octokit.issues.listComments({
      owner: site.issues.owner,
      repo: site.issues.repo,
      issue_number: issueNumber,
    });

    const comments = response.data
      .sort((comment1, comment2) => {
        return comment1.created_at < comment2.created_at ? 1 : -1;
      })
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
      body: JSON.stringify(comments),
    };
  } catch (message) {
    return {
      statusCode: 400,
      body: message ?? 'Unable to fetch comments for this post. Check back later.',
    };
  }
};

module.exports = { handler };
