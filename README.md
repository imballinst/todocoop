# todocoop

Create rooms for a synchronized to-do list without registration.

## Stack

- [React Router](https://reactrouter.com/) 8 (SPA mode) + Vite
- [Chakra UI](https://chakra-ui.com/) 3
- [TanStack Query](https://tanstack.com/query) 5
- Netlify Functions + MongoDB (Mongoose)

## Requirements

- Node.js 24 or above (see `.nvmrc`)
- Yarn 1
- [Netlify CLI](https://docs.netlify.com/cli/get-started/) for running the API locally

## Setup

1. Install dependencies:

   ```sh
   yarn
   ```

2. Copy `.env.example` to `.env.development.local` and fill in the MongoDB and
   session values.

3. Run the app with the Netlify dev server so the API function is available:

   ```sh
   netlify dev
   ```

   The frontend alone can be run with `yarn dev`.

## Scripts

- `yarn dev` — Vite/React Router dev server (no API function).
- `yarn build` — production build into `build/client`.
- `yarn typecheck` — generate route types and run `tsc`.
- `yarn test` / `yarn test:watch` — Vitest.
- `yarn cleanup` — delete rooms inactive for more than a day.

## Deployment

Netlify builds with `yarn build` and publishes `build/client`. API requests
under `/api/*` are rewritten to `netlify/functions/api.ts` (see `netlify.toml`).
