# Functions

Serverless functions used by my front end as an API. Currently running as Cloudflare Workers.

| Function                                         | Description                                              | HTTP Route (configured in Cloudflare) |
| ------------------------------------------------ | -------------------------------------------------------- | ------------------------------------- |
| [`comments/comments.ts`](./comments/comments.ts) | Fetches comments from the GitHub Issues API for my blog. | `/api/comments?id=123`                |

Each function is defined in its own directory and needs the following files:

- `.dev.vars` for environment secrets (gitignored)
- `wrangler.toml` for the worker config

See `*.example` files for sample configs.

[Read the Cloudflare Worker documentation](https://developers.cloudflare.com/workers/get-started/quickstarts/)

## Running a Worker Locally

From the `functions` directory:

```
pnpm wrangler dev -c comments/wrangler.toml
```

Or from the project root:

```
pnpm run -F functions dev -c comments/wrangler.toml
```

## Deploying a Worker

From the `packages/functions` directory:

```
pnpm wrangler deploy -c comments/wrangler.toml
```

Or from the project root:

```
pnpm run -F functions deploy -c comments/wrangler.toml
```