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

# Execute the main command
exec "$@"
