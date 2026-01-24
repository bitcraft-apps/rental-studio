# syntax=docker/dockerfile:1

# Multi-stage Dockerfile for Rental Studio (Bun + Hono)
# Supports both development and production builds

# =============================================================================
# Stage 1: Base image with Bun runtime
# =============================================================================
FROM oven/bun:1.1-alpine AS base

WORKDIR /app

# Install curl for healthchecks
RUN apk add --no-cache curl

# =============================================================================
# Stage 2: Install dependencies
# =============================================================================
FROM base AS deps

# Copy workspace configuration files
COPY package.json bun.lock ./
COPY apps/web/package.json ./apps/web/
COPY packages/core/package.json ./packages/core/

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

# =============================================================================
# Stage 4: Production image (minimal)
# =============================================================================
FROM base AS production

ENV NODE_ENV=production
ENV PORT=3000

# Copy only production dependencies
COPY package.json bun.lock ./
COPY apps/web/package.json ./apps/web/
COPY packages/core/package.json ./packages/core/

RUN bun install --frozen-lockfile --production

# Copy built artifacts
COPY --from=build /app/apps/web/dist ./apps/web/dist
# Core package exports TypeScript source directly (no build step)
# Version is now injected at build time, so package.json is not needed at runtime
COPY --from=build /app/packages/core/src ./packages/core/src

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
