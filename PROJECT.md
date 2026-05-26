# homeshared

## Scope

Application multi-plateforme (Android natif + Web + iOS PWA) permettant à des
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
- Mobile Android en priorité, web / PWA iOS en complément.
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
- [ ] Connexion réelle à un projet Supabase (URL + keys)
- [ ] Migration Prisma initiale appliquée
- [ ] Test E2E manuel : signup → création groupe → invitation → ajout course → validation → apparition frigo → matching recette
- [ ] Polish UI : icônes, loader states, error states, vide states
- [ ] Build web PWA déployé (Vercel)
- [ ] APK Android signé téléchargeable
- [ ] Intégration brique `@tech-bricks/ads` (bannière sur l'écran groupes)

## Hors-scope v1 (→ BACKLOG.md)

- Cartes de fidélité partagées
- OCR de tickets de caisse
- Notifications push
- Mode offline complet avec sync
- Magic link auth
- App Store iOS (juste PWA pour l'instant)
- Recettes communautaires modérées
- Photos de plats

## Briques tech-bricks utilisées

- `@tech-bricks/auth-supabase` v0.1.0 (wrapper Supabase Auth)
- `@tech-bricks/ads` v0.1.0 (stub, intégration AdMob réelle en v1.1)

## Démarrage de la semaine

- **Jour 1 (2026-05-26)** : cadrage + scaffold complet monorepo + API + mobile (squelettes UI fonctionnels)
