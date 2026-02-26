#!/bin/sh
set -e

echo "🚀 Starting VEXIA Data Validation Engine..."

# Wait for database to be ready
echo "⏳ Waiting for database..."
until nc -z vexia-postgres 5432; do
  echo "⏳ Database is unavailable - sleeping"
  sleep 2
done

echo "✅ Database is ready!"

# Run migrations using the Prisma binary from the build
echo "🔄 Running database migrations..."
cd /app
if [ -f "node_modules/.bin/prisma" ]; then
  node_modules/.bin/prisma migrate deploy || echo "⚠️ Migrations failed or already applied"
else
  echo "⚠️ Prisma CLI not found, skipping migrations"
fi

echo "✅ Starting application..."

# Switch to nextjs user and execute the main command
exec su-exec nextjs "$@"
