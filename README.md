# Rental Studio

Property management and renovation planning platform for landlords.

## Status

**Work in Progress** - This project is under active development.

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
| Hosting | Hetzner (Docker) + Cloudflare CDN |

## Project Structure

```
rental-studio/
├── apps/
│   └── web/              # Main Hono application
├── packages/
│   └── shared/           # Shared types and utilities
├── docker/
│   ├── Dockerfile
│   └── docker-compose.yml
└── scripts/
    └── deploy.sh
```

## Development

```bash
# Install dependencies
bun install

# Run development server
bun run dev

# Run database migrations
bun run db:migrate
```

## License

This project is licensed under the [Business Source License 1.1](LICENSE).

After the Change Date (4 years from initial release), the license converts to Apache 2.0.

## Author

Bitcraft Apps
