#!/bin/bash

set -euo pipefail

PROJECT_DIR="${PROJECT_DIR:-/home/z/my-project}"
BUILD_DIR="${BUILD_DIR:?BUILD_DIR is required}"

# C5 — this app is client-side and local-first: it has NO database (state
# lives in the browser's localStorage; the repository carries no Prisma
# schema and no db:push script). The old step unconditionally ran
# `bun run db:push`, which does not exist and broke packaging. A database
# is only packaged if one actually exists in the project (it does not);
# the sync step runs ONLY when the project itself defines db:push.

SOURCE_DB_DIR="$PROJECT_DIR/db"
SOURCE_DB_PATH="$SOURCE_DB_DIR/custom.db"
TARGET_DB_DIR="$BUILD_DIR/db"
TARGET_DB_PATH="$TARGET_DB_DIR/custom.db"

if [ ! -f "$SOURCE_DB_PATH" ]; then
    echo "ℹ️  No database in this project (local-first app) — skipping the db step."
    exit 0
fi

mkdir -p "$TARGET_DB_DIR"
echo "🗄️  Copying the Preview database into the build output..."
cp -a "$SOURCE_DB_DIR/." "$TARGET_DB_DIR/"

if grep -q '"db:push"' "$PROJECT_DIR/package.json"; then
    echo "🗄️  Syncing the database structure (project defines db:push)..."
    (
        cd "$PROJECT_DIR"
        DATABASE_URL="file:$TARGET_DB_PATH" bun run db:push
    )
    if [ ! -f "$TARGET_DB_PATH" ]; then
        echo "❌ Database sync ran but $TARGET_DB_PATH was not created"
        exit 1
    fi
else
    echo "ℹ️  Project has a database file but no db:push script — copied as-is."
fi

echo "✅ Build database preparation done"
ls -lah "$TARGET_DB_DIR"
