#!/bin/sh
set -e

echo "🚀 Starting VEXIA Data Validation Engine..."

# Wait for database
echo "⏳ Waiting for database..."
until node node_modules/.bin/prisma db push --skip-generate 2>/dev/null; do
  echo "⏳ Database is unavailable - sleeping"
  sleep 2
done

echo "✅ Database is ready!"

# Run migrations
echo "🔄 Running database migrations..."
node node_modules/.bin/prisma migrate deploy

echo "✅ Migrations completed!"

# Execute the main command
exec "$@"
