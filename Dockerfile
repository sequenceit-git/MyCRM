# Stage 1: Build Vite React Frontend
FROM node:22-alpine AS frontend-build

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ ./

ENV VITE_BACKEND_SERVER=/

RUN npm run build

# Stage 2: Production Single Container Application
FROM node:22-alpine

WORKDIR /app

# Copy backend package files and install production dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm install --omit=dev

# Copy backend source code
COPY backend/ ./backend/

# Copy built frontend static assets directly into backend static dist directory
COPY --from=frontend-build /app/frontend/dist ./backend/src/public/dist

WORKDIR /app/backend

EXPOSE 8888

ENV NODE_ENV=production

CMD ["node", "src/server.js"]
