#!/usr/bin/env bash
# ==============================================================================
# MyCRM Server Deployment & Update Script
# ==============================================================================
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "=================================================="
echo "🚀 Starting MyCRM Deployment / Update..."
echo "=================================================="

# 1. Verify Docker & Docker Compose installation
if ! command -v docker &> /dev/null; then
    echo "❌ Error: Docker is not installed or not in PATH."
    exit 1
fi

# 2. Ensure the external Traefik proxy network exists
echo "🌐 Ensuring 'proxy' Docker network exists..."
docker network create proxy 2>/dev/null || true

# 3. Pull latest git changes if in a git repository
if [ -d .git ]; then
    echo "📥 Fetching latest code changes from origin/master..."
    git fetch origin master
    git reset --hard origin/master
fi

# 4. Pull pre-built images or build locally
echo "🐳 Pulling latest images & starting application containers..."
docker compose pull app 2>/dev/null || true
docker compose up -d --build --remove-orphans

# 5. Handle optional command line flags
for arg in "$@"; do
    case $arg in
        --setup)
            echo "⚙️ Running core setup script..."
            docker exec -it mycrm-app npm run setup
            ;;
        --seed)
            echo "🌱 Running demo seed script..."
            docker exec -it mycrm-app npm run seed
            ;;
        --setup-guest)
            echo "👤 Setting up guest admin account..."
            docker exec -it mycrm-app npm run setup-guest
            ;;
        --help)
            echo "Usage: ./deploy.sh [OPTIONS]"
            echo "Options:"
            echo "  --setup         Run core database & default settings setup"
            echo "  --seed          Seed demo data & admin accounts"
            echo "  --setup-guest   Create view-only guest admin"
            exit 0
            ;;
    esac
done

# 6. Clean up dangling images
echo "🧹 Pruning old Docker images..."
docker image prune -f

echo "=================================================="
echo "✅ MyCRM Deployment completed successfully!"
echo "🌐 Available at: https://mycrm.sequenceit.software"
echo "=================================================="
