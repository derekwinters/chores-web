# Chores Web

A household chore management app with flexible scheduling, point tracking,
and multi-user support.

> **This repository has been split.** Development now happens in dedicated
> repositories; this repo remains as the docker-compose quick-start and
> historical record.

## Where things live now

| Repository | Purpose |
|---|---|
| [chores-web-backend](https://github.com/derekwinters/chores-web-backend) | FastAPI REST API, architecture docs, ADRs |
| [chores-web-frontend](https://github.com/derekwinters/chores-web-frontend) | React SPA |
| [chores-web-docs](https://github.com/derekwinters/chores-web-docs) | User-facing docs + the API contract (`openapi.json`, `API_VERSION`) |
| [chores-web-android](https://github.com/derekwinters/chores-web-android) | Native Android client |
| [chores-web-ha-plugin](https://github.com/derekwinters/chores-web-ha-plugin) | Home Assistant integration |
| [chores-web-design-tokens](https://github.com/derekwinters/chores-web-design-tokens) | Shared design tokens |
| [chores-web-actions](https://github.com/derekwinters/chores-web-actions) | Shared CI actions and reusable workflows |

The full pre-split history is preserved here and carried into each
extracted repository.

## Quick start

Run the whole stack from published images:

```bash
git clone https://github.com/derekwinters/chores-web.git
cd chores-web
JWT_SECRET=$(openssl rand -hex 32) docker compose up -d
```

- **App:** http://localhost:3000
- **API docs:** http://localhost:8000/docs

The compose file pulls `ghcr.io/derekwinters/chores-web-backend` and
`ghcr.io/derekwinters/chores-web-frontend` (`:latest`; see the comments in
`docker-compose.yml` to pin a version).

## Issues and contributions

Open issues and pull requests in the repository that owns the affected
component (see the table above).
