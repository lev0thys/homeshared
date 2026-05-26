# homeshared

Hub partagé pour foyers : groupes, listes de courses, frigo, recettes.
Multi-plateforme — Android natif (Play Store + APK direct), Web, iOS via PWA.

## Stack

- **Frontend** : Expo + React Native + RN Web + Expo Router + NativeWind + TanStack Query + Zustand + i18next
- **Backend** : Fastify + TypeScript + Prisma + PostgreSQL (Supabase)
- **Auth & Realtime** : Supabase (Auth + Realtime + Storage)
- **Ads** : `@tech-bricks/ads` (AdMob, en attente d'intégration finale)
- **Monorepo** : pnpm workspaces

## Démarrage

```bash
# 1. Installer les deps
pnpm install

# 2. Configurer les variables d'env
cp .env.example .env
# Renseigner DATABASE_URL, SUPABASE_URL, SUPABASE_*_KEY, JWT_SECRET (≥ 32 chars)

# 3. Générer le client Prisma + appliquer les migrations
pnpm prisma:generate
pnpm prisma:migrate

# 4. Seed du catalogue de recettes
pnpm --filter @homeshared/api prisma:seed

# 5. Lancer l'API
pnpm dev:api

# 6. Lancer le mobile (dans un autre terminal)
pnpm dev:mobile
# Puis appuyer sur :
#   w → ouvrir le web (http://localhost:8081)
#   a → lancer un emulateur Android
```

## Structure

```
homeshared/
├── apps/
│   ├── api/            # Fastify + Prisma
│   └── mobile/         # Expo (Android + Web + PWA iOS)
├── packages/
│   └── shared/         # Types + schemas Zod partagés
├── PROJECT.md          # Scope, stack, objectifs v1
├── DAILY.md            # Log quotidien
├── BACKLOG.md          # Features v2+
└── CHANGELOG.md
```

## Documentation

- `PROJECT.md` — scope, stack, objectifs
- `DAILY.md` — état d'avancement (mis à jour à chaque session)
- `BACKLOG.md` — features non prévues (v1.x / v2)

## Build & déploiement

- **APK Android** : `eas build --platform android` (config `eas.json` à ajouter au 1er build)
- **Web (PWA)** : `pnpm --filter @homeshared/mobile build:web` → déployer le contenu de `dist/` sur Vercel/Netlify
- **API** : à arbitrer (Fly.io, Railway, Render)
