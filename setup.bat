@echo off
echo 🚀 Setting up Hachidori Admin API...

REM 1. Install dependencies
echo 📦 Installing dependencies...
call pnpm install --frozen-lockfile

REM 2. Generate Prisma client
echo 🔧 Generating Prisma client...
call pnpm generate

REM 3. Apply migrations (production-safe)
echo 📂 Applying migrations...
call pnpm migrate:deploy

REM 4. Ask about seeding
set /p confirm=🌱 Do you want to seed the database? (y/N):
if /i "!confirm!"=="y" (
    call pnpm seed
)

REM 5. Build project
echo 🏗️ Building project...
call pnpm build

echo ✅ Setup complete!
