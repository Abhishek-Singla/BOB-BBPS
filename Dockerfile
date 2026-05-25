# Multi-stage build for production-grade Kubernetes delivery
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency manifests
COPY package.json package-lock.json* tsconfig.json vite.config.ts tailwind.config* ./
RUN npm install

# Copy application source code
COPY ./src ./src
COPY ./index.html ./index.html
COPY ./metadata.json ./metadata.json

# Build optimized static files
RUN npm run build

# Stage 2: Serve via hardened Nginx Alpine
FROM nginx:1.25-alpine

# Copy custom secure Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled static files
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
