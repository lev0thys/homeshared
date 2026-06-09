# homeshared

Hub partagé pour foyers : groupes, listes de courses, frigo, recettes.
Multi-plateforme — Android natif (Play Store + APK direct), Web, iOS via PWA.

## Stack

- **Frontend** : Expo + React Native + RN Web + Expo Router + NativeWind + TanStack Query + Zustand + i18next
- **Backend** : Fastify + TypeScript + Prisma + PostgreSQL (Supabase)
- **Auth & Realtime** : Supabase (Auth + Realtime + Storage)
- **Ads** : `@tech-bricks/ads` (AdMob, en attente d'intégration finale)
- **Monorepo** : pnpm workspaces

## Pourquoi Supabase (Postgres) et pas MongoDB ?

- Le projet utilise **Prisma + relations SQL** (groupes, membres, listes, frigo, recettes). MongoDB impliquerait un **autre modèle de données** et une **réécriture** de l’API.
- **Supabase** = Postgres managé + **Auth** (email / Google) + stockage possible + gratuit pour démarrer. Une seule stack cohérente avec le mobile (Supabase JS).
- Si un jour tu veux Mongo : ce serait un **nouveau backend** ou un projet séparé — pas un simple switch d’URL.

## Démarrage

```bash
# 0. (Optionnel) Postgres local pour les migrations — nécessite [Docker Desktop](https://www.docker.com/products/docker-desktop/) installé et démarré.
docker compose up -d

_Si tu n’as pas Docker : ignore cette étape et mets dans `.env` la `DATABASE_URL` fournie par Supabase (onglet Database)._
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

## Dépannage : `gh` / « gh n'est pas reconnu »

Après `winget install GitHub.cli`, **ferme et rouvre** le terminal (ou Cursor) pour recharger le PATH.

Sinon, lance `gh` avec le chemin complet :

```powershell
& "C:\Program Files\GitHub CLI\gh.exe" auth login
```

Le script `scripts/push-to-github.ps1` tente aussi d’ajouter `C:\Program Files\GitHub CLI` au PATH **pour la session en cours** si `gh` est absent.

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

## Variables à aller chercher sur Supabase

Copie-les dans **`homeshared/.env`** (racine du projet, fichier **non versionné**). Pour le mobile, duplique au minimum les `EXPO_PUBLIC_*` dans **`homeshared/apps/mobile/.env`**.

| Variable | Où dans le dashboard Supabase |
|----------|-------------------------------|
| `DATABASE_URL` | **Project Settings** → **Database** → *Connection string* / URI `postgresql://postgres:…@db.<ref>.supabase.co:5432/postgres` (remplace le placeholder du mot de passe ; encode `,` `*` etc. en `%2C` `%2A` si besoin). |
| `SUPABASE_URL` | **Project Settings** → **API** → *Project URL* |
| `SUPABASE_ANON_KEY` | **Project Settings** → **API** → clé publique (*anon* / *publishable*) |
| `SUPABASE_SERVICE_ROLE_KEY` | **Project Settings** → **API** → *service_role* (secret, **jamais** dans le mobile) |
| `JWT_SECRET` | Pas sur Supabase : chaîne aléatoire **≥ 32 caractères** (ex. deux GUID collés). |
| `EXPO_PUBLIC_API_URL` | Pas sur Supabase : en local `http://localhost:3001`. |
| `EXPO_PUBLIC_SUPABASE_URL` | **Même valeur** que `SUPABASE_URL`. |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | **Même valeur** que `SUPABASE_ANON_KEY`. |

Quand tu as ces valeurs, envoie-les dans le chat (ou colle-les toi-même dans `.env`) — on peut générer le fichier **`homeshared/.env`** pour toi **sans** les committer (déjà dans `.gitignore`).

## Build & déploiement

- **APK Android** : `eas build --platform android` (config `eas.json` à ajouter au 1er build)
- **Web (PWA)** : `pnpm --filter @homeshared/mobile build:web` → déployer le contenu de `dist/` sur Vercel/Netlify
- **API** : à arbitrer (Fly.io, Railway, Render)
