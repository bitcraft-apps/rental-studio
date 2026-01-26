# syntax=docker/dockerfile:1

# Multi-stage Dockerfile for Rental Studio (Bun + Hono)
# Supports both development and production builds

# =============================================================================
# Stage 1: Base image with Bun runtime
# =============================================================================
FROM oven/bun:1.3-alpine AS base

WORKDIR /app

# Install curl for healthchecks
RUN apk add --no-cache curl

# =============================================================================
# Stage 2: Install dependencies
# =============================================================================
FROM base AS deps

# Copy workspace configuration files
# NOTE: When adding new workspace packages, add their package.json here
COPY package.json bun.lock ./
COPY apps/web/package.json ./apps/web/
COPY packages/core/package.json ./packages/core/
COPY packages/database/package.json ./packages/database/

# Install all dependencies (including devDependencies for build)
RUN bun install --frozen-lockfile

# =============================================================================
# Stage 3: Build the application
# =============================================================================
FROM deps AS build

# Copy source code
COPY . .

# Build all packages
RUN bun run build

# Verify build artifacts exist (fail fast if build silently failed)
RUN test -f ./apps/web/dist/index.js || (echo "Build failed: dist/index.js not found" && exit 1)

# =============================================================================
# Stage 4: Production image (minimal)
# =============================================================================
FROM base AS production

ENV NODE_ENV=production
ENV PORT=3000

# Copy built artifacts only - the bundle is fully self-contained
# Bun.build() inlines all workspace dependencies (@rental-studio/core) and node_modules (hono)
# No runtime dependencies needed - just copy the bundle
COPY --from=build /app/apps/web/dist ./apps/web/dist

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 -G nodejs

USER nodejs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/health || exit 1

CMD ["bun", "run", "apps/web/dist/index.js"]

# =============================================================================
# Stage 5: Development image (with hot-reload support)
# =============================================================================
FROM deps AS development

ENV NODE_ENV=development
ENV PORT=3000

# Copy source for initial setup (will be overridden by volume mount)
COPY . .

EXPOSE 3000

CMD ["bun", "run", "dev"]
