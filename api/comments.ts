import { Octokit } from '@octokit/rest';
import { createTokenAuth } from '@octokit/auth-token';
import { sanitizeHtml } from '../config/utils.js';
import { markdown } from '../config/plugins/markdown.js';
import site from '../src/_data/site.js';
import dayjs from 'dayjs';
import dayjsRelativeTimePlugin from 'dayjs/plugin/relativeTime.js';
dayjs.extend(dayjsRelativeTimePlugin);

// Abort build if this is missing
if (!process.env.GITHUB_PERSONAL_ACCESS_TOKEN) {
  throw new Error('Missing environment variable: GITHUB_PERSONAL_ACCESS_TOKEN');
}

// Authenticate with GitHub Issues SDK. Do this only once for the module rather than per request.
const auth = createTokenAuth(process.env.GITHUB_PERSONAL_ACCESS_TOKEN);
const { token } = await auth();
const octokit = new Octokit({ auth: token });

type PostComment = {
  /** The user who posted the comment. */
  user: {
    /** The URL for the user's profile photo. */
    avatarUrl: string;
    /** The user's username */
    name: string;
    /** Whether the user is me (author of the blog). */
    isAuthor: boolean;
  },
  /** A raw datetime string representing when the comment was created. */
  dateTime: string;
  /** A human-readable string, relative to now, when the comment was created (e.g., `"20 hours ago"`). */
  dateRelative: string;
  /** Whether the comment was edited. */
  isEdited: boolean;
  /** The sanitized comment body, as an HTML string. */
  body: string;
}

/** Netlify handler for serverless function. Returns comments for a given post by ID. */
export default async function getCommentsForPost(request: Request) {
  let issueNumber = new URL(request.url).searchParams.get('id');
  if (!issueNumber) {
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
        issue_number: parseInt(issueNumber, 10),
        sort: 'created_at',
        direction: 'desc',
        per_page: 100, // this is the max number of results per page that the API supports
      },
      (response) => response.data.map((comment) => ({
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
}
