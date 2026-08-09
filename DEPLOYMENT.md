# MyCRM Traefik Deployment Guide

Domain: `mycrm.sequenceit.software`

---

## 1. Fast Server Deployment

Clone the repository on your VPS:

```bash
git clone https://github.com/sequenceit-git/MyCRM.git
cd MyCRM
```

Ensure your Traefik external network exists:
```bash
docker network create proxy || true
```

Start the containers (No Nginx needed &mdash; Traefik routes directly to the application container):
```bash
docker compose up -d --build
```

---

## 2. Seed Initial Admin Accounts

Run setup & seed scripts inside the app container:
```bash
# Setup default settings & core database collections
docker exec -it mycrm-app npm run setup

# Seed admin accounts & demo data
docker exec -it mycrm-app npm run seed

# Setup guest view-only admin
docker exec -it mycrm-app npm run setup-guest
```

---

## Admin Logins

- **Super Admin**: `admin@admin.com` / `admin123`
- **Guest Admin**: `guest@admin.com` / `guest123` *(View-Only Mode)*
