# API homeshared — image Docker pour Fly.io
FROM node:22-alpine
# Prisma query engine (musl) — libssl requis en prod Alpine
RUN apk add --no-cache openssl openssl-dev
RUN corepack enable && corepack prepare pnpm@9.15.9 --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
COPY docker/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY packages/shared ./packages/shared
COPY apps/api ./apps/api

RUN pnpm install --frozen-lockfile --filter @homeshared/api...
WORKDIR /app/apps/api
RUN pnpm exec prisma generate

ENV NODE_ENV=production
EXPOSE 3001
CMD ["pnpm", "exec", "tsx", "src/server.ts"]
