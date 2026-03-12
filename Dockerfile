# Dockerfile pour Next.js Frontend — Eventy Life
# Utilise le mode standalone pour une image production optimisée (~150MB vs ~1GB)

# ===== Stage 1: Dépendances =====
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# ===== Stage 2: Build =====
FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Variables d'environnement build-time (remplacer en CI)
ARG NEXT_PUBLIC_API_URL=http://localhost:4000/api
ARG NEXT_PUBLIC_STRIPE_PUBLIC_KEY=
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_STRIPE_PUBLIC_KEY=$NEXT_PUBLIC_STRIPE_PUBLIC_KEY
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# ===== Stage 3: Production =====
FROM node:18-alpine AS runner
WORKDIR /app

# Installer dumb-init pour un arrêt gracieux des signaux
RUN apk add --no-cache dumb-init curl

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Créer un utilisateur non-root
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copier les fichiers statiques publics
COPY --from=builder /app/public ./public

# Copier le build standalone (Next.js output: 'standalone')
# Le dossier .next/standalone contient un server.js minimal + node_modules nécessaires
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
    CMD curl -f http://localhost:3000/ || exit 1

# dumb-init → node server.js (standalone ne nécessite PAS npm run start)
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]
