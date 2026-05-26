# Daily Log — homeshared

## 📌 État actuel

- **Version** : 0.1.0 (scaffold)
- **Branche active** : dev (à créer au 1er commit)
- **Dernier commit** : (à venir)
- **Prochaine étape** : configurer un projet Supabase, brancher `.env`, lancer `prisma migrate dev`, démarrer l'API + le mobile, valider le E2E.

---

## 2026-05-26 (mardi)

### Fait
- [x] Cadrage projet (scope, stack, périmètre v1 vs backlog).
- [x] Monorepo pnpm + tsconfig commun + lint/format (`homeshared/`).
- [x] Package partagé `@homeshared/shared` :
  - Types : `User`, `Group`, `Membership`, `ShoppingItem`, `FridgeItem`, `Recipe`.
  - Schemas Zod : signup/login/profile, group, shopping, fridge, recipe matching.
  - Erreurs typées `ApiError` + `ApiErrorCode`.
- [x] **API Fastify** (`apps/api/`) :
  - Bootstrap, plugins (Prisma, Auth Supabase, error handler).
  - Schéma Prisma complet avec relations.
  - Routes : `/health`, `/api/auth/me`, `/api/users`, `/api/groups` (CRUD + invites), `/api/shopping` (avec transition automatique vers le frigo), `/api/fridge`, `/api/recipes` (+ endpoint `/match` qui matche les recettes au frigo).
  - Service `recipe-matching.service.ts` : algorithme de scoring.
  - Seed initial de 3 recettes.
- [x] **App mobile Expo** (`apps/mobile/`) :
  - Configuration Expo Router (file-based), NativeWind, i18next (FR + EN).
  - Composants UI : `Screen`, `Button`, `Input`.
  - Écrans : auth (login, signup), home (liste groupes), création groupe, détail groupe, courses, frigo, recettes.
  - Tabs auto sur `/groups/[groupId]/*`.
  - Store Zustand pour la session Supabase.
  - Manifest web PWA configuré (installable iOS).
- [x] **Briques tech-bricks** :
  - `tech-bricks/ts/auth-supabase` v0.1.0 : wrapper Supabase Auth avec erreurs typées (MIT).
  - `tech-bricks/react-native/ads` v0.1.0 : API publique gelée (AdBanner, showInterstitial, showRewardedAd), implémentation stub (AdMob branché en v0.2).

### En cours
- [ ] Premier `pnpm install` + premier commit + push GitHub.
- [ ] Création du projet Supabase + récupération des clés.
- [ ] Première migration Prisma sur la DB Supabase.

### Bloqueurs / Décisions à prendre
- **gh CLI auth** : Steve doit lancer `gh auth login` (interactif) pour qu'on puisse créer le repo et push les 3 branches.
- **Projet Supabase** : à créer côté Steve (https://supabase.com → New Project) — gratuit. Une fois fait, copier l'URL, anon key et service_role key dans `.env`.
- **Compte AdMob** : optionnel pour la v1 (IDs de test fonctionnent en dev).

### Briques tech-bricks
- Utilisé : `@tech-bricks/auth-supabase` v0.1.0
- Stub intégré pour : `@tech-bricks/ads` v0.1.0
- Candidat futur : brique `i18n` à factoriser depuis `apps/mobile/src/lib/i18n` lors du 2ᵉ projet utilisateur.
