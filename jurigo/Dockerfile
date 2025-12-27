FROM node:22-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY jurigo/package.json jurigo/package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY jurigo/ .

# Build arguments for environment variables needed at build time
ARG DATABASE_URL=postgresql://localhost:5432/jurigo
ARG BETTER_AUTH_SECRET=build-time-secret
ARG BETTER_AUTH_URL=http://localhost:3000

ENV DATABASE_URL=$DATABASE_URL
ENV BETTER_AUTH_SECRET=$BETTER_AUTH_SECRET
ENV BETTER_AUTH_URL=$BETTER_AUTH_URL
ENV NODE_ENV=production

RUN npm run build 2>&1 || (echo "Build failed with exit code $?" && ls -la /app && exit 1)

# Production image, copy all the files and run
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 jurigo

COPY --from=builder /app/.output ./.output
COPY --from=builder /app/drizzle ./drizzle
COPY --from=builder /app/package.json ./package.json

USER jurigo

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", ".output/server/index.mjs"]
