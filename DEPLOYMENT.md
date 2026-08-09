# MyCRM Deployment Guide (Traefik + Docker)

Domain: `mycrm.sequenceit.software`

## Prerequisites
- Server with Docker and Docker Compose installed.
- Running Traefik proxy on docker network `proxy`.

---

## 1. Fast Server Deployment

Clone the repository on your server:

```bash
git clone https://github.com/sequenceit-git/MyCRM.git
cd MyCRM
```

Ensure the `proxy` network exists (used by Traefik):
```bash
docker network create proxy || true
```

Start the containers:
```bash
docker compose up -d --build
```

---

## 2. Seed Initial Admin Account

Run initial database setup & demo data seed:
```bash
# Setup default settings & core collections
docker exec -it mycrm-backend npm run setup

# Seed admin accounts & demo data
docker exec -it mycrm-backend npm run seed

# Setup guest view-only admin
docker exec -it mycrm-backend npm run setup-guest
```

---

## Admin Logins

- **Super Admin**: `admin@admin.com` / `admin123`
- **Guest Admin**: `guest@admin.com` / `guest123` (View-Only Mode)
