# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copier les fichiers package
COPY package*.json ./

# Installer les dépendances
RUN npm ci

# Copier le code source
COPY . .

# Build l'application
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Installer dumb-init et curl pour les health checks
RUN apk add --no-cache dumb-init curl

# Copier les fichiers package
COPY package*.json ./

# Installer les dépendances de production
RUN npm ci --only=production

# Copier la build depuis le stage builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

# Créer un utilisateur non-root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs

EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
    CMD curl -f http://localhost:3000/api/health || curl -f http://localhost:3000 || exit 1

# Utiliser dumb-init pour un arrêt gracieux
ENTRYPOINT ["dumb-init", "--"]

CMD ["npm", "run", "start"]
