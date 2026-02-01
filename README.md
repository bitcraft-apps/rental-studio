# Rental Studio

Property management and renovation planning platform for landlords.

## Status

**Work in Progress** - This project is under active development.

## Documentation

- [Agents Guide](docs/AGENTS.md)

## Features (Planned)

### MVP - Renovation Planning
- Interactive floor plans (SVG-based) with hotspots
- Layer system (electrical, furniture, fixtures)
- Design project variants
- Secure sharing with collaborators

### Future - Tenant Portal
- Magic link authentication
- Issue reporting and tracking
- Document management (contracts, manuals)
- Payment tracking
- Equipment inventory

## Tech Stack

| Component | Technology |
|-----------|------------|
| Runtime | Bun |
| Backend | Hono |
| Frontend | Hono JSX + HTMX |
| Database | PostgreSQL + Drizzle ORM |
| Email | Resend |
| Hosting | Docker (Dokku example), Cloudflare CDN |

## Prerequisites

- Bun (see `.bun-version`)
- Docker + Docker Compose (recommended for fastest setup)
- PostgreSQL (optional if not using Docker)

## Quickstart (recommended: Docker)

This path is the fastest way to get running.

```bash
# 1) Configure environment
cp .env.example .env

# 2) Install dependencies
bun install

# 3) Start app + database
bun run docker:dev
```

Open http://localhost:3000

## Local Development (without Docker)

```bash
# Install dependencies
bun install

# Copy env template and adjust DATABASE_URL to your local Postgres
cp .env.example .env

# Ensure the database exists and matches DATABASE_URL
# Example: createdb rental_studio

# Run database migrations
bun run db:migrate

# Run development server
bun run dev
```

## Environment Variables

See `.env.example` for full list. Key variables:

- `NODE_ENV` (development/production)
- `PORT` (default 3000)
- `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, `POSTGRES_PORT`
- `DATABASE_URL` (used for local development without Docker)

Note: The Docker Compose files set `DATABASE_URL` for the `web` service using the
`POSTGRES_*` variables and the `postgres` service hostname. See
`docker/docker-compose*.yml`.

## Database Setup & Migrations

Drizzle is configured in `drizzle.config.ts` and migrations are stored in `drizzle/`.

```bash
# Generate migrations from schema changes
bun run db:generate

# Apply migrations
bun run db:migrate

# Open Drizzle Studio
bun run db:studio
```

## Docker Development

```bash
# Start dev containers
bun run docker:dev

# Rebuild after dependency changes
bun run docker:dev:build
```

The app exposes a health check at `GET /health` (used by Dokku and Docker).
If you change it, update the Docker and Dokku checks accordingly.

## Deployment (generic)

This repo includes a production-ready Dockerfile and an example Dokku workflow.
You can adapt this to any Docker-compatible host.

### Docker image

```bash
docker build -t rental-studio .
docker run -p 3000:3000 --env-file .env rental-studio
```

### Dokku (example)

- See `scripts/dokku-setup.sh` for a baseline setup script.
- Zero-downtime checks use `CHECKS` and hit `/health`.
- GitHub Actions deploys are defined in `.github/workflows/deploy.yml` and require:
  - `DOKKU_SSH_KEY`
  - `DOKKU_KNOWN_HOSTS`
  - `HETZNER_HOST`

If you use a different host, replace the deploy step with your provider-specific
push/deploy mechanism.

## Project Structure

```
rental-studio/
├── apps/
│   └── web/              # Main Hono application
├── packages/
│   ├── core/             # Shared constants/utilities
│   └── database/         # Drizzle schema + DB client
├── drizzle/              # SQL migrations
├── docker/               # Docker Compose files
├── scripts/              # Ops scripts (e.g., Dokku setup)
└── .github/              # CI/CD workflows
```

## Contributing

Before opening a PR, run:

```bash
bun run lint
bun run typecheck
bun run test
```

CI will run the same checks on pull requests.

## License

This project is licensed under the [Business Source License 1.1](LICENSE).

After the Change Date (4 years from initial release), the license converts to Apache 2.0.

## Author

Bitcraft Apps
