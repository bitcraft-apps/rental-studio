#!/bin/bash
# Dokku Production Setup Script
#
# This script sets up the production Dokku app. Run it on the Dokku server:
#   ssh root@<DOKKU_HOST> 'bash -s' < scripts/dokku-setup.sh
#
# Or copy-paste commands manually if you prefer.

set -euo pipefail

APP_NAME="rental-studio"
DOMAIN="rental-studio.bitcraftapps.dev"

echo "=== Dokku Production Setup ==="
echo "App: $APP_NAME"
echo "Domain: $DOMAIN"
echo ""

# Create app (idempotent)
echo "Creating app..."
dokku apps:create "$APP_NAME" 2>/dev/null || echo "  App already exists, skipping"

# Set domain
echo "Setting domain..."
dokku domains:set "$APP_NAME" "$DOMAIN"

# Configure ports - Cloudflare handles SSL, so we only expose HTTP
echo "Configuring ports (HTTP only - Cloudflare handles SSL)..."
dokku ports:set "$APP_NAME" http:80:3000

# Ensure checks are enabled for zero-downtime deploys
echo "Enabling deployment checks..."
dokku checks:enable "$APP_NAME" web

echo ""
echo "=== Setup Complete ==="
echo ""
echo "Next steps:"
echo "  1. Push to trigger deployment:"
echo "     git push dokku main"
echo ""
echo "  2. Or trigger via GitHub Actions:"
echo "     gh workflow run deploy.yml -f environment=production"
echo ""
echo "  3. Verify deployment:"
echo "     curl -I https://$DOMAIN"
echo ""
