# ─────────────────────────────────────────────
#  Multi-stage Docker build for Node.js app
#  Base image: node:20-alpine (minimal footprint)
# ─────────────────────────────────────────────

# ── Stage 1: Install dependencies ────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency manifests first (leverages Docker layer caching)
COPY package*.json ./

# Install production dependencies only
RUN npm ci --omit=dev

# ── Stage 2: Production image ────────────────
FROM node:20-alpine

WORKDIR /app

# Copy installed node_modules from builder stage
COPY --from=builder /app/node_modules ./node_modules

# Copy application source code
COPY . .

# Expose the application port
EXPOSE 3000

# Run as non-root user for security
USER node

# Start the server
CMD ["node", "app.js"]
