# Changelog

Format : [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/), SemVer.

## [Unreleased]

_Expérimentations UI / navigation — voir branche `experiment/ui`._

## [1.1.0] - 2026-06-21

Version stable V2 avant refonte graphique. Tag : `v1.1.0`, branche de secours : `release/v1.1`.

### v2 — Carte magasin (polish)
- **Carte plein slot** : `fitViewBoxToViewport` — plus de bandes vides / plan miniature sur web.
- **Rendu carto** : couloirs crème, gondoles au mètre, îlots allée transparents, échelle 1 m / 5 m.
- **UX** : centrage ◎ (barre + flottant), fiche `!` magasin inconnu, sélecteur plan retiré de l’écran principal.
- **Tests** : `store-map-viewport.test.ts` (3).

### v2 — mode magasin (fondation)
- **RLS Supabase** : script `supabase/rls/001_enable_rls.sql` + `pnpm rls:apply` — tables protégées, email/token isolés.
- **Package `@homeshared/store-navigation`** : layouts 2D, calcul de route par rayons, tests.
- **Mode magasin** : bouton « Je suis au magasin », plan schématique SVG, parcours rayon par rayon.
- **Optimistic UI** : cocher article sans attendre le réseau (`useOptimisticPurchase`).

### v2 — PDR + contributions communautaires
- **BDD** : modèles `StoreContributionBatch`, `StoreContributionEvent`, `ContributorTrust`.
- **API** : `GET/POST /api/stores/contributions` — agrégats pondérés, détection magasin pionnier, rate limits batch.
- **Mobile** : `usePdrSession` (podomètre), `useContributionDraft`, `useStoreSession`, bandeau pionnier, long-press recalage, signalement rupture.

### v2 — Perf (bloc 6)
- **Cache local** : `lib/local-cache/` — contributions 15 min, Overpass 24 h, layout 7 j.
- **Snapshot mode magasin** : liste figée à l'entrée, zéro refetch shopping pendant la session.
- **Invalidations ciblées** : debounce 2 s fridge/recipes hors mode magasin ; realtime suspendu en magasin.
- **API** : `Cache-Control` sur agrégats contributions.

### v2 — Bloc 3 géoloc magasin
- **GPS** : permission foreground `expo-location` au lancement mode magasin.
- **Overpass** : POI `shop=supermarket|convenience|grocery` dans 500 m, cache local 24 h.
- **Choix magasin** : sheet avec liste, auto-sélection si un seul POI ≤ 80 m, reprise dernier magasin.
- **Profil layout** : heuristique enseigne OSM → hyper / super / proxi.
- **Session** : `storeOsmId` réel + coordonnées entrée pour contributions communautaires.

### v2 — Maps de base auto (GPS → type magasin)
- **Détection enrichie** : `inferLayoutProfileDetailed` (Carrefour Market/City, Lidl, Monoprix, Super U, etc.) + niveau de confiance.
- **Métadonnées plans** : `getLayoutProfileMeta` — description et parcours type par profil.
- **Aperçus visuels** : miniatures SVG hyper/super/proxi dans le picker et le switcher.
- **Switcher en session** : ajuster le plan si la détection est incorrecte (persisté par magasin).
- **Auto-pick amélioré** : sélection du plus proche si ≤ 80 m ou clairement devant le 2e candidat.
- **Carte enrichie** : badge type sur le plan, pins orange des emplacements communautaires.
- **UX test** : changer de magasin depuis le mode magasin, coords GPS affichées, confirmation envoi contributions.

### Corrigé (v2 stabilisation)
- **PDR** : dépendances React stabilisées (`recalibrate` au lieu de l’objet `pdr` entier) — plus de boucle de recalage.
- **CI locale** : `scripts/verify-local.mjs` + `pnpm verify` fiables sous Windows.
- **Tests** : +8 tests (PDR polyline, productFingerprint, contributions service).
- **RLS Supabase v2** : `002_v2_contributions_rls.sql` + `003_auth_initplan.sql` ; `pnpm rls:apply` exécute les 3 scripts.

### Ajouté (publication web + Play Store)
- **Guide déploiement** : `docs/DEPLOYMENT.md` (API Fly.io, site Vercel, Play Store EAS).
- **API Docker** : `Dockerfile` + `fly.toml` pour hébergement production.
- **Web PWA** : `vercel.json`, manifest, service worker, icônes, page `/download`.
- **Play Store** : descriptions FR/EN, icône 512, profil EAS submit.

### Ajouté (v1 — légal & sync)
- **Sync temps réel** : hook `useGroupRealtime` (courses, frigo, planning, tâches, chat) + doc `docs/REALTIME-SETUP.md`.
- **RGPD** : `DELETE /api/users/me`, UI suppression compte profil, politique confidentialité `/privacy`.
- **Consentement pubs** : UMP Google via `@tech-bricks/ads` v0.2 (`requestAdsConsent`, préférences profil Android).
- **Templates légaux** : `templates/legal/privacy-policy.fr.md` + `.en.md`.
- **Checklist E2E** : `docs/E2E-CHECKLIST.md`.

### Sécurité & contenu recettes
- Validateur catalogue : températures viande/poisson, anti-placeholders, unités œufs.
- 31+ recettes : instructions exploitables, nems (pré-cuisson), pho bœuf, brochettes 74 °C.
- Scripts `pnpm recipes:patch`, `pnpm recipes:audit`.

### Amélioré (perf)
- Matching frigo : une recette = une requête DB ; filtre cuisine sur le catalogue.
- Index `MealPlanEntry(groupId, cookedAt)` pour réservations planning.

### Amélioré (UX)
- Accueil : libellés sous les espaces / groupes du carrousel.
- Fiche groupe : bandeau résumé (courses en attente, produits frigo, repas planifiés).
- Planning : navigation entre semaines, mise en avant du jour courant, % frigo colorés.
- Frigo : tri par urgence DLC, pull-to-refresh, accès planning depuis les réservations.

### Ajouté
- **Droits repas groupe** : titulaire configure qui voit / choisit les créneaux (VIEW, EDIT_SLOT, EDIT_ALL), règles auto « qui cuisine quand », heures repas.
- **Sync repas → tâches** : création auto tâches préparation/cuisson avec rappel à l'heure du repas (si activé).
- **Recettes mobile** : navigation par tuiles, super-catégories, filtres rapides, portions au stepper.
- **Mode enfant** : compte ou membre marqué enfant → actions sensibles masquées (courses, tâches, gestion groupe).
- **Checkout courses** : tout au caddie, valider après paiement (vide liste, frigo déjà rempli).
- **Export liste** : partage texte pour drive en ligne (ADR-003).
- **Recettes favorites** + tri prioritaire dans matching frigo.
- **Ajouter ingrédients manquants** d'une recette à la liste de courses.
- **Tâches maison** : module groupe TASKS (unique/quotidienne/hebdo/mensuelle, prise en charge par membre).
- **Profil utilisateur** : bio, stats groupes/favoris, écran profil.
- **Saison & jardin** : calendrier France enrichi (~45 entrées chacun).
- **9 recettes** supplémentaires avec instructions détaillées (28 total).
- **Catalogue massif** : 231 recettes (salades → rouleaux de printemps → desserts), +58 ingrédients, script `pnpm recipes:generate`.
- Scripts racine `pnpm prisma:db-push` / `pnpm prisma:seed` (évite l'erreur « prisma not found »).
- Avatars membres sur écran accueil groupe.

### Ajouté (sessions précédentes)
- Hub accueil avec modules perso (saison, jardin, magasins, catalogue recettes).
- Recettes mode étape par étape (`RecipeStepper`) + bascule texte brut.
- Icônes catégorie ingrédients (`IngredientAvatar`) sur courses et recettes.
- API `GET /api/tools/season`, `GET /api/tools/garden` (données France).
- API magasins mock : suggest + comparateur de prix (`/api/stores/*`).
- Lien courses → magasins (voir en magasin + comparer la liste).
- Chat de groupe (`GroupMessage`, panneau latéral modal).
- 6 recettes supplémentaires (19 au total après seed).
- Checklist de tests modulaires : `docs/FEATURES.md`.

### Optimisé (infra & perf)
- Scores frigo du planning repas en batch (3 requêtes DB / semaine au lieu de N).
- Cache catalogue ingrédients 5 min pour l’écran frigo.
- Typecheck mobile : client `api.put`, génériques React Query.
- Cache auth API 5 min (0 SQL si cache hit vs 4–5 requêtes/requête).
- Sync user : `findUnique` rapide au lieu d'`upsert` systématique.
- Reconnexion Prisma auto (`withPrismaReconnect`) sur ConnectionReset.
- Logs `prisma:query` désactivés sauf `PRISMA_LOG_QUERIES=1`.
- `GET /health/db` avec hint si DB down.
- Cache mobile 24h catalogues statiques (saison/jardin).
- Message clair si API injoignable (fetch fail).
- `DIRECT_DATABASE_URL` + guide `docs/SETUP-STEVE.md`.

### Corrigé (session tests)
- Imports API `tools.routes` / `stores.routes` (chemin prisma corrigé — l’API ne démarrait pas).
- Suggestions magasin par article : une requête par ligne (plus de mélange).
- Comparateur : auto-lancement depuis liste de courses.

### Tests automatisés
- `scripts/test-features-api.mjs` → 12/12 OK
- Vitest API → 15/15 OK

### Corrigé
- Ajout liste de courses : `groupId` manquant sur onglets Expo (web) → `useGroupId()`.
- Frigo : formulaire d’ajout manuel côté mobile.

### Ajouté
- Espace personnel « Mon espace » (auto-créé, `isPersonal`).
- Modules par groupe (`features` : SHOPPING, FRIDGE, RECIPES) + toggles propriétaire.
- Suppression de groupe (`DELETE /api/groups/:id`).
- Onglets conditionnels selon modules actifs.

### Corrigé (session précédente)
- Auth web : `localStorage` pour Supabase (plus AsyncStorage sur RN Web).
- Inscription : retry `signInWithPassword` si pas de session après `signUp`.
- Messages FR pour « Failed to fetch » et config manquante (`DevConfigWarning`).
- `app.config.js` + `dotenv` : injection fiable des `EXPO_PUBLIC_*` dans `expo-constants`.
- NativeWind dark mode web (`darkMode: 'class'`, `nativewind-setup.ts`).
- Metro monorepo pnpm : deps manquantes + résolution `.ts` pour `@homeshared/shared`.
- API auth : collision `username` unique à la sync Prisma (fallback `user_<id>`).
- Scripts : `test-supabase-auth.mjs`, `smoke-stack.ps1` (smoke E2E signup + `/api/groups`).

### Ajouté
- **Catalogue d'ingrédients** : table `Ingredient` (slug, catégorie, aliases FR), 49 ingrédients + 13 recettes seedées.
- API `GET /api/ingredients` et `GET /api/ingredients/:slug` (liste + détail avec recettes liées).
- Matching recettes amélioré : normalisation accents/ligatures (œ→oe) + aliases (« œufs » matche `oeuf`).
- ADR `docs/adr/002-catalogue-ingredients-normalises.md`.
- Scripts `prisma:migrate-catalog`, `prisma:db-push`.
- Tests unitaires API : `group.service`, `recipe-matching.service`, `fridge.service` (7 tests Vitest).
- Écran mobile « Rejoindre un groupe » (`app/(app)/join.tsx`) + partage d’invitation native.
- Composants UX : `LoadingCenter`, `EmptyState`, hook `useMutationError`, bannière pub placeholder.
- Suppression d’articles sur la liste de courses (appui long).
- Clés i18n `invite.*` et messages de suppression courses.
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

## [1.0.0] - 2026-06-10

Première version produit validée (courses, frigo, recettes, planning, tâches, déploiement web + APK).
Tag : `v1.0.0`, branche figée : `release/v1.0` (commit `ad535c5`).
