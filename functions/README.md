# Cloudflare Workers

| Function                                         | Description                                              | HTTP Route (configured in Cloudflare) |
| ------------------------------------------------ | -------------------------------------------------------- | ------------------------------------- |
| [`comments/comments.ts`](./comments/comments.ts) | Fetches comments from the GitHub Issues API for my blog. | `/api/comments?id=123`                |

Each function is defined in its own directory and needs the following files:

- `.dev.vars` for environment secrets (gitignored)
- `wrangler.toml` for the worker config

See `*.example` files for sample configs.

[Read the Cloudflare Worker documentation](https://developers.cloudflare.com/workers/get-started/quickstarts/)

## Running a Worker Locally

From the root directory:

```
pnpm wrangler dev -c functions/comments/wrangler.toml
```

## Deploying a Worker

From the root directory:

```
pnpm wrangler deploy -c functions/comments/wrangler.toml
```