# Agent Instructions: Echo Latency Tester

## Stack & Architecture
- **Pure JavaScript Worker**: The project has zero TypeScript config. The main entrypoint is `/worker.js`.
- **Wrangler Version**: Uses Wrangler v4 (`npx wrangler`).
- **No Build Step**: The worker is directly executable by the Cloudflare Workers runtime.

## Key Developer Commands
- **Local Dev Server**: `npx wrangler dev` (Runs local server on `http://localhost:8787`).
- **Deployment**: `npx wrangler deploy` (Do not run custom build steps first).

## CORS & Relay Routing Architecture
- All requests (`GET`, `POST`, `OPTIONS`) must handle CORS headers to support optional relay proxy servers.
- **OPTIONS preflights** must return a `204 No Content` status with full CORS headers, specifically including the custom `X-Sleep-For` header:
  ```javascript
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Sleep-For",
    "Access-Control-Max-Age": "86400",
  };
  ```

## Critical Constraints
- **NO GIT OPERATIONS**: Do not execute Git commands (add, commit, push, branch, etc.) unless the user explicitly overrides this. Keep operations confined to file modifications and local verification commands.
