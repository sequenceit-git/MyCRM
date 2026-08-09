<div align="center">
  <h1>💼 MyCRM</h1>
  <p><b>Cloud ERP & CRM Business Management Platform</b></p>
  <p>
    <a href="https://mycrm.sequenceit.software">Live Application</a> •
    <a href="#-quick-start">Quick Start</a> •
    <a href="#-traefik--docker-deployment">Docker & Traefik Deployment</a>
  </p>
</div>

---

## 🌟 Overview

**MyCRM** is an all-in-one Cloud ERP & CRM management platform built on the modern MERN stack (**Node.js, Express, MongoDB, React, Redux, Ant Design**). It features a clean, elevated UI design with soft rounded cards (`#f0f5fa` canvas), interactive dashboard filters, section-wise skeleton loading, role-based permissions (Super Admin vs Guest View-Only), and single-command Docker deployment with **Traefik**.

Hosted Domain: **[https://mycrm.sequenceit.software](https://mycrm.sequenceit.software)**  
Git Repository: **[https://github.com/sequenceit-git/MyCRM.git](https://github.com/sequenceit-git/MyCRM.git)**

---

## ✨ Features

- 📊 **Interactive Dashboard**:
  - **KPI Summary Cards**: Real-time totals for *Paid Invoices*, *Unpaid Invoices*, *Total Invoiced*, and *Quotes*.
  - **Date Range Filters**: Filter summary metrics by *Yesterday*, *Last Week*, *Last Month*, *Last Year*, or *From Beginning*.
  - **Performance Progress Bars**: Status breakdowns for Invoices, Quotes, and Collection & Revenue rates.
  - **Circular Customer Gauge**: Active customer growth percentage and total counts.
  - **Recent Activity Tables**: Quick access to recent invoices and quotes with single-click PDF downloads.

- 👥 **Customer Relationship Management (CRM)**:
  - Manage client profiles, addresses, phone numbers, and email contacts.

- 📄 **Invoicing & Quote Management**:
  - Full CRUD lifecycle for **Invoices** and **Proforma Quotes**.
  - Integrated PDF generation, instant payment recording, and status tagging (*Draft, Sent, Pending, Paid, Partially Paid, Overdue, Accepted, Declined*).

- 💳 **Payments & Tax Settings**:
  - Payment modes management (Bank Transfer, Credit Card, PayPal, Cash).
  - Tax rates configuration and automatic calculation on items.

- ⚡ **Seamless Skeleton Loading System**:
  - Persistent sidebar and header navigation.
  - Section-wise and field-level **Skeleton Shimmer Loaders** during data fetching without full-page flickering.

- 🔐 **Role-Based Access Control (RBAC)**:
  - **Super Admin**: Full read/write/edit access.
  - **Guest Admin**: View-Only mode with visual indicator pills and read-only form protections.

---

## 🛠️ Technology Stack

- **Frontend**: React.js, Vite, Ant Design (AntD v5), Redux Toolkit / React Redux, Custom CSS Tokens.
- **Backend**: Node.js, Express.js, MongoDB (Mongoose ORM), JWT Authentication, HTML-PDF generator.
- **Deployment**: Docker, Docker Compose, Traefik Reverse Proxy (SSL/TLS ready).

---

## ⚡ Quick Start (Local Development)

### Prerequisites
- Node.js (v18 or v20)
- MongoDB server running locally or MongoDB Atlas connection string.

### 1. Clone Repository
```bash
git clone https://github.com/sequenceit-git/MyCRM.git
cd MyCRM
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create .env file with database connection & secret keys
cat <<EOT > .env
PORT=8888
DATABASE=mongodb://127.0.0.1:27017/idurar
SECRET=mycrm_super_secret_jwt_key_2026
JWT_SECRET=mycrm_jwt_secret_token_2026
NODE_ENV=development
EOT

# Initialize database collections & seed demo data
npm run setup
npm run seed
npm run setup-guest

# Start backend dev server
npm run dev
```

### 3. Frontend Setup
```bash
# In a new terminal window:
cd frontend
npm install

# Start frontend dev server (runs at http://localhost:3000)
npm run dev
```

---

## 🐳 Traefik & Docker Deployment

Deploy to your production VPS with **Traefik** routing for `mycrm.sequenceit.software` in a single command.

### 1. Deploy on Server
```bash
# Clone on server
git clone https://github.com/sequenceit-git/MyCRM.git
cd MyCRM

# Ensure Traefik network exists
docker network create proxy || true

# Build & launch app and MongoDB containers
docker compose up -d --build
```

### 2. Initialize Seed Data on Server
```bash
docker exec -it mycrm-app npm run setup
docker exec -it mycrm-app npm run seed
docker exec -it mycrm-app npm run setup-guest
```

---

## 🔑 Default Admin Logins

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@admin.com` | `admin123` | Full Access (Create/Read/Update/Delete) |
| **Guest Admin** | `guest@admin.com` | `guest123` | View-Only Mode |

---

## 📄 License

Released under the **MIT License**.
