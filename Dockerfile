# Stage 1: Build Vite React Frontend
FROM node:22-alpine AS frontend-build

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci || npm install

COPY frontend/ ./

ENV VITE_BACKEND_SERVER=/

RUN npm run build

# Stage 2: Production Single Container Application
FROM node:22-alpine

WORKDIR /app

# Copy backend package files and install production dependencies
COPY backend/package*.json ./backend/
RUN cd backend && (npm ci --omit=dev || npm install --omit=dev)

# Copy backend source code
COPY backend/ ./backend/

# Copy built frontend static assets directly into backend static dist directory
COPY --from=frontend-build /app/frontend/dist ./backend/src/public/dist

# Ensure upload directories exist for file attachments, logos, and avatars
RUN mkdir -p ./backend/src/public/uploads/admin \
             ./backend/src/public/uploads/setting \
             ./backend/src/public/uploads/client \
             ./backend/src/public/uploads/invoice

WORKDIR /app/backend

EXPOSE 8888

ENV NODE_ENV=production
ENV PORT=8888

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD node -e "require('http').get('http://127.0.0.1:' + (process.env.PORT || 8888) + '/', (res) => process.exit(res.statusCode < 500 ? 0 : 1)).on('error', () => process.exit(1))"

CMD ["node", "src/server.js"]
