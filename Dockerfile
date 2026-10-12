# Production Dockerfile for Atelier Café Loyalty & POS Platform
FROM oven/bun:latest

WORKDIR /app

# Copy application files
COPY package.json ./
COPY index.html ./
COPY css ./css
COPY js ./js
COPY server ./server
COPY data ./data

# Expose server port
EXPOSE 8787

# Persistent volume for SQLite database
VOLUME ["/app/data"]

ENV NODE_ENV=production
ENV PORT=8787

# Start production server
CMD ["bun", "server/server.js"]
