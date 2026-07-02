#!/bin/sh
set -e

# Sync schema to DB on boot (no migration files in this project — uses db push).
echo "==> prisma db push"
node ./node_modules/prisma/build/index.js db push --skip-generate

exec "$@"
