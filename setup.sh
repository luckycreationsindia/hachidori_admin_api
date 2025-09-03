#!/bin/bash
set -e

echo "🚀 Setting up Hachidori Admin API..."

# 1. Install dependencies
echo "📦 Installing dependencies..."
pnpm install --frozen-lockfile

# 2. Generate Prisma client
echo "🔧 Generating Prisma client..."
pnpm generate

# 3. Apply migrations (production-safe)
echo "📂 Applying migrations..."
pnpm migrate:deploy

# 4. Ask about seeding
read -p "🌱 Do you want to seed the database? (y/N): " confirm
if [[ "$confirm" == "y" || "$confirm" == "Y" ]]; then
  pnpm seed
fi

# 5. Build project
echo "🏗️ Building project..."
pnpm build

echo "✅ Setup complete!"
