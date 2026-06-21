# homeshared

## Scope

Application multi-plateforme (Android + iOS natifs + Web PWA) permettant à des
utilisateurs de créer des **groupes** (foyer, colocs, famille…) et de partager
en leur sein du contenu collaboratif :

- **Liste de courses partagée** : chaque membre ajoute des items, on voit qui
  a ajouté quoi, on coche au caddie → l'item bascule dans le frigo du groupe.
- **Frigo virtuel** : alimenté par les validations de la liste de courses ou
  par saisie manuelle, avec gestion optionnelle des dates d'expiration.
- **Recettes** : catalogue partagé, matching automatique avec le frigo du
  groupe pour proposer "que cuisiner avec ce que j'ai".

La v1 vise une UI finie et professionnelle plutôt qu'une multitude de modules.
Les autres modules (cartes de fidélité, tickets OCR, etc.) sont en backlog.

## Public cible

- Foyers francophones (langue principale FR, EN beta).
- Mobile Android en priorité, **iOS App Store** dès que la v2 est validée (compte Apple Developer 1 an — Steve, mai 2026), web / PWA en complément.
- Modèle économique : freemium léger + bannières AdMob (non bloquantes).

## Stack

- **Langage** : TypeScript strict partout
- **Frontend** : Expo SDK 51 + React Native 0.74 + RN Web + Expo Router
- **UI** : NativeWind (Tailwind) + composants custom
- **State / data** : Zustand (UI) + TanStack Query (server state)
- **i18n** : i18next (FR + EN beta)
- **Backend** : Fastify 5 + Prisma 5 + PostgreSQL (Supabase free tier)
- **Auth** : Supabase Auth (email/password + Google OAuth)
- **Realtime** : Supabase Realtime (Postgres CDC)
- **Tests** : Vitest (logique pure + API)
- **Lint/Format** : ESLint + Prettier
- **Monorepo** : pnpm workspaces

## Objectifs v1 (cible 1 semaine, dérapage assumé jusqu'à ~12 jours)

- [x] Scaffold monorepo + outillage (lint, format, CI, hooks)
- [x] Schéma de données complet (User, Group, Membership, ShoppingItem, FridgeItem, Recipe, Ingredient, Invite)
- [x] API : routes auth, users, groups, invites, shopping, fridge, recipes (CRUD + matching)
- [x] Mobile : écrans auth (login, signup), home (liste groupes), création groupe, détail groupe, listes courses, frigo, recettes
- [x] Sync temps réel (hook `useGroupRealtime` + doc Supabase `docs/REALTIME-SETUP.md`)
- [x] Politique de confidentialité in-app (`/privacy`) + templates `templates/legal/`
- [x] Suppression compte RGPD (`DELETE /api/users/me` + UI profil)
- [x] Consentement pubs UMP (`@tech-bricks/ads` v0.2 + `ads-init.ts`)
- [x] Checklist E2E manuelle (`docs/E2E-CHECKLIST.md`)
- [ ] Connexion réelle à un projet Supabase (URL + keys) — **Steve** (`docs/SETUP-STEVE.md`)
- [ ] Realtime activé sur tables Supabase — **Steve** (`docs/REALTIME-SETUP.md`)
- [ ] Migration Prisma initiale versionnée (optionnel si db-push suffit en dev)
- [ ] Test E2E manuel complet coché (`docs/E2E-CHECKLIST.md`)
- [x] Polish UI : icônes, loader states, error states, vide states (itérations continues)
- [ ] Build web PWA déployé (Vercel) — config prête : `docs/DEPLOYMENT.md` + `vercel.json`
- [ ] APK Android signé téléchargeable — EAS `preview` / page `/download`
- [ ] Play Store publié — **quand version affinée** (Steve : fiches + captures à ce moment-là ; EAS `production` déjà prévu)
- [ ] App Store iOS publié — **idem, pas urgent** (compte Apple Developer 1 an en réserve ; App Store Connect + fiche au moment voulu)
- [x] Intégration brique `@tech-bricks/ads` (bannière + UMP consent)

## Hors-scope v1 (→ BACKLOG.md)

- Cartes de fidélité partagées
- OCR de tickets de caisse
- Notifications push
- Mode offline complet avec sync
- Magic link auth
- ~~App Store iOS~~ → **cible post-v2** (compte Apple Developer actif ; voir BACKLOG)
- Recettes communautaires modérées
- Photos de plats

## Briques tech-bricks utilisées

- `@tech-bricks/auth-supabase` v0.1.0 (wrapper Supabase Auth)
- `@tech-bricks/ads` v0.2.0 (AdMob bannière + consentement UMP)

## Démarrage de la semaine

- **Jour 1 (2026-05-26)** : cadrage + scaffold complet monorepo + API + mobile (squelettes UI fonctionnels)
