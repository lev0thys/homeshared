# Changelog

Format : [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/), SemVer.

## [Unreleased]

### Ajouté
- Scaffold initial du monorepo pnpm (`apps/api`, `apps/mobile`, `packages/shared`).
- API Fastify + Prisma + PostgreSQL :
  - Schéma complet (User, Group, Membership, Invite, ShoppingItem, FridgeItem, Recipe, RecipeIngredient).
  - Routes : auth/me, users, groups (CRUD + invitations), shopping (avec promotion auto au frigo), fridge, recipes (catalogue + matching).
  - Algorithme de matching recettes ↔ frigo avec score.
  - Plugin auth Supabase + synchronisation lazy des utilisateurs.
  - Error handler centralisé + erreurs typées.
- App mobile Expo + RN Web :
  - Expo Router (file-based), NativeWind, i18next (FR + EN), TanStack Query, Zustand.
  - Écrans : login, signup, home (liste groupes), création groupe, détail groupe, courses, frigo, recettes.
  - Composants UI : `Screen`, `Button`, `Input`.
  - Manifest PWA installable iOS.
- Package `@homeshared/shared` : types + schemas Zod + erreurs.
- Configuration : Prettier, EditorConfig, `.nvmrc`, `.env.example`.
- Briques tech-bricks créées :
  - `@tech-bricks/auth-supabase` v0.1.0
  - `@tech-bricks/ads` v0.1.0 (stub)
