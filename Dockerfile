# Base image for build stage
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the entire frontend project
COPY . .

# Build the frontend
RUN npm run build

# Serve the built files using a lightweight web server
FROM nginx:alpine

# Set working directory in nginx
WORKDIR /usr/share/nginx/html

# Remove default nginx static files
RUN rm -rf ./*

# Copy the built frontend files from builder stage
COPY --from=builder /app/dist .

# Expose the port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
