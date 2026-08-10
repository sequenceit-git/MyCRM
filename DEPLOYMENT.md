# MyCRM Deployment & CI/CD Guide

Domain: `mycrm.sequenceit.software`

---

## 1. Automated CI/CD Pipeline

The repository includes a complete GitHub Actions CI/CD pipeline located in `.github/workflows/`:

- **CI (`.github/workflows/ci.yml`)**:
  - **Triggers**: Pull requests and pushes to `master`, `dev`, `feat/**`, and `fix/**`.
  - **Jobs**:
    - **Frontend Quality & Build**: Installs dependencies with npm caching, runs ESLint checks, and performs a production Vite build.
    - **Backend Validation**: Installs dependencies and runs syntax/integrity checks on Express controllers and routes.
    - **Docker Build Check**: Builds the multi-stage Docker image with GitHub Actions layer caching (`gha`) to guarantee that the container builds cleanly.

- **CD (`.github/workflows/cd.yml`)**:
  - **Triggers**: Pushes to `master`, version tags (`v*`), or manual execution via `workflow_dispatch`.
  - **Jobs**:
    - **Build & Publish**: Builds the production Docker image and publishes it to GitHub Container Registry (`ghcr.io/sequenceit-git/mycrm`).
    - **Automated VPS Deployment**: Connects via SSH to your VPS, updates the repository/containers, performs zero-downtime rolling updates, and prunes stale images.

---

## 2. GitHub Secrets Configuration for Automated Deployment

To enable automated CD deployment to your VPS, add the following secrets under **Settings > Secrets and variables > Actions** in your GitHub repository:

| Secret Name | Description | Example |
|---|---|---|
| `VPS_HOST` | IP address or domain name of your VPS | `123.45.67.89` or `mycrm.sequenceit.software` |
| `VPS_USERNAME` | SSH username on the server | `root` or `ubuntu` |
| `VPS_SSH_KEY` | Private SSH key (matching `~/.ssh/authorized_keys` on VPS) | `-----BEGIN OPENSSH PRIVATE KEY----- ...` |
| `VPS_SSH_PORT` | *(Optional)* SSH Port (defaults to `22` if not set) | `22` |
| `DEPLOY_PATH` | *(Optional)* Directory on VPS where repo is located | `/opt/mycrm` or `/home/ubuntu/MyCRM` |

### Setting up SSH Key on VPS:
```bash
# On your local machine or server, generate a deployment key pair:
ssh-keygen -t ed25519 -C "github-actions-mycrm" -f ~/.ssh/id_mycrm_deploy

# Append the public key to authorized_keys on your VPS:
cat ~/.ssh/id_mycrm_deploy.pub >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys

# Copy the contents of id_mycrm_deploy (private key) into GitHub Secret 'VPS_SSH_KEY'
```

---

## 3. Manual Server Deployment & Helper Script

### Fast Initial Deployment:
```bash
git clone https://github.com/sequenceit-git/MyCRM.git /opt/mycrm
cd /opt/mycrm

# Ensure Traefik external proxy network exists
docker network create proxy || true

# Run deployment script
chmod +x deploy.sh
./deploy.sh
```

### Script Usage & Flags:
```bash
./deploy.sh                  # Standard update / restart
./deploy.sh --setup          # Run default collections & settings setup
./deploy.sh --seed           # Seed demo data & admin accounts
./deploy.sh --setup-guest    # Setup guest view-only admin
```

---

## 4. Seeding & Initial Admin Setup

Run setup scripts inside the app container:
```bash
# Setup default settings & core database collections
docker exec -it mycrm-app npm run setup

# Seed admin accounts & demo data
docker exec -it mycrm-app npm run seed

# Setup guest view-only admin
docker exec -it mycrm-app npm run setup-guest
```

### Admin Credentials:
- **Super Admin**: `admin@admin.com` / `admin123`
- **Guest Admin**: `guest@admin.com` / `guest123` *(View-Only Mode)*

---

## 5. Monitoring & Logs

```bash
# View real-time application logs
docker logs -f mycrm-app

# View database logs
docker logs -f mycrm-db

# Check running status
docker compose ps
```
