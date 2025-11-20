import { makeMarkdownParser } from 'web/lib/plugins/markdown.js';
import { Octokit } from '@octokit/rest';
import { createTokenAuth } from '@octokit/auth-token';
import { sanitizeHtml } from 'web/lib/utils/string.js';
import site from 'web/src/_data/site.js';
import type { PostComment, PostCommentResponse } from 'web/lib/types.js';
import { RequestError } from '@octokit/request-error';

const markdownToHTML = makeMarkdownParser({ isTrustedInput: false });

/**
 * Generator that yields one comment at a time for the given repo issue.
 */
async function* fetchComments(octokit: Octokit, issueNumber: number) {
  // This is the max that the github issues api supports. Max it out to minimize number of round trips.
  const commentsPerPage = 100;
  let page = 1;

  while (true) {
    const response = await octokit.request('GET /repos/{owner}/{repo}/issues/{issue_number}/comments', {
      owner: site.repo.owner,
      repo: site.repo.name,
      issue_number: issueNumber,
      sort: 'created_at',
      direction: 'desc',
      page,
      per_page: commentsPerPage,
    });

    console.log(`GitHub API responded with status ${response.status}.`);
    console.log(response.headers);

    // Loop over comments in each page and massage them into a custom shape
    for (const item of response.data) {
      const comment = {
        user: {
          avatarUrl: item.user!.avatar_url,
          url: item.user!.html_url,
          // Sanitize usernames to prevent XSS
          name: sanitizeHtml(item.user!.login),
          ...(item.author_association === 'OWNER' ? { isAuthor: true } : {}),
        },
        date: item.created_at,
        ...(item.created_at !== item.updated_at ? { isEdited: true } : {}),
        // Sanitize comment body to prevent XSS
        body: sanitizeHtml(markdownToHTML.render(item.body ?? '')).trim(),
      } satisfies PostComment;
      yield comment;
    }

    // https://docs.github.com/en/rest/using-the-rest-api/using-pagination-in-the-rest-api?apiVersion=2022-11-28&versionId=free-pro-team%40latest&restPage=getting-started-with-the-rest-api#using-link-headers
    if (!response.headers.link?.includes(`rel="next"`)) {
      break;
    }

    page++;
  }
}

export default {
  /** Returns comments for a given post by ID. https://developers.cloudflare.com/workers/runtime-apis/handlers/
   * @param request The incoming HTTP request.
   * @param env Environment secrets set for this worker.
   */
  async fetch(request: Request, env: Record<string, string>) {
    const headers =
      env.ENVIRONMENT === 'development'
        ? ({
            'Access-Control-Allow-Origin': '*',
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

    try {
      // Authenticate with GitHub Issues SDK
      const auth = createTokenAuth(env.GITHUB_PERSONAL_ACCESS_TOKEN);
      const { token } = await auth();
      const octokit = new Octokit({ auth: token });

      // Input validation
      const issueNumber = parseInt(new URL(request.url).searchParams.get('id'), 10);
      if (Number.isNaN(issueNumber)) {
        return new Response(
          JSON.stringify({
            error: 'Invalid request. Expected a number for the GitHub issue ID.',
          } satisfies PostCommentResponse),
          { status: 400, headers }
        );
      }

      // This will stream comments to client one by one (faster than waiting for all the comments at once)
      const stream = new ReadableStream({
        async start(controller) {
          const encoder = new TextEncoder();
          try {
            for await (const comment of fetchComments(octokit, issueNumber)) {
              const ndjsonChunk = `${JSON.stringify({ data: comment } satisfies PostCommentResponse)}\n`;
              controller.enqueue(encoder.encode(ndjsonChunk));
            }
          } catch (error) {
            console.log(error);

            let errorMessage = 'An unknown error occurred while fetching comments.';
            // Rate limiting error from GitHub API
            if (error instanceof RequestError && (error.status === 403 || error.status === 429)) {
              errorMessage = 'The API has currently hit its rate limit. Please try again later.';
            }

            // It would be nice if we could return a 500 or more specific error code as a Response, but we already returned this stream in a 200.
            // The best we can do at this point is just terminate the stream with some info to let the client know what went wrong.
            controller.enqueue(
              encoder.encode(`${JSON.stringify({ error: errorMessage } satisfies PostCommentResponse)}\n`)
            );
          } finally {
            controller.close();
          }
        },
      });

      // Send the stream down immediately so client doesn't have to wait for the full response.
      // This makes the API feel faster on articles that have lots of comments.
      return new Response(stream, {
        headers: {
          ...headers,
          'Content-Type': 'application/x-ndjson',
          'Cache-Control': 'no-cache',
        },
      });
    } catch (error) {
      console.log(error);
      return new Response(
        JSON.stringify({
          error: 'An unknown error occurred while fetching comments.',
        } satisfies PostCommentResponse),
        { ...headers, status: 500 }
      );
    }
  },
};
