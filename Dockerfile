#stage build
FROM node:latest AS builder
WORKDIR /app
COPY . .
RUN npm ci
RUN npm audit fix
RUN npm run build
#nginx build
FROM nginx:latest
# Set working directory to nginx asset directory
WORKDIR /usr/share/nginx/html
# Remove default nginx static assets
RUN rm -rf ./*
# Copy static assets from builder stage
COPY --from=builder /app/dist .
# Containers run nginx with global directives and daemon off
ENTRYPOINT ["nginx", "-g", "daemon off;"]


