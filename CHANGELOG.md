# Changelog

Format : [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/), SemVer.

## [Unreleased]

### Build Android Play Store
- **Expo SDK 53** + target API 35 ; build AAB local Windows (Gradle) sans quota EAS.
- Scripts `build-android-aab-local.ps1`, `setup-android-sdk.ps1`, workflow GHA `eas-build-android-local.yml`.
- Plugin `withMonorepoAndroidGradle` (monorepo Metro + signature release via `keystore.properties`).

### Qualité & stabilité (suite)
- **Mobile `typecheck` vert** : meal-plan snapshots, match portions, widgets Android, hooks optimistic/notifications.
- **Dev** : `prisma generate` + serveurs relancés (`:3001` / `:8081`).
- **Tests** : 14 mobile + 13 shared verts.

### Qualité & stabilité
- **Web** : notifications en stubs (plus de crash Metro `expo-notifications`).
- **API** : corrections TypeScript (snapshots repas, nutrition, seed, archives courses).
- **Shared** : type `IngredientMacrosPer100g` extrait, emojis robustes.
- **UI** : favoris hub ★/☆, warning Expo AdMob config nettoyé.
- **DB** : `notificationPrefs` poussé en base (`prisma db push`).

### Notifications — rappels locaux (mobile)
- **Profil** : section Notifications (interrupteur global, rappel tâche prise, rappel hebdo plan repas jour/heure).
- **Mobile** : `expo-notifications` — planification locale, sync via `GET /api/tasks/me/reminders`.
- **API** : `User.notificationPrefs` (JSON) ; préférences frigo/courses enregistrées pour v2.
- **Migration** : `pnpm prisma:db-push`.

### Nutrition — profil, recettes & foyer
- **Profil** : taille, poids, sexe, activité, objectif + consentement RGPD ; calcul BMR/TDEE (Mifflin-St Jeor / ANSES).
- **Groupe** : `GET /api/groups/:id/nutrition-summary` — agrégat calorique repas (données privées).
- **Recettes** : kcal + macros estimés par portion (CIQUAL) ; panneau détail + couverture % besoin foyer.
- **Shared** : `nutrition.ts`, `ingredient-nutrition.ts` + tests.
- **Migration** : `pnpm prisma:db-push` + `pnpm prisma:seed` (recalcule `nutritionPerServing`).

### Widgets Ã©cran d'accueil â€” Android + iOS
- **Android** : courses interactives (cocher, ajout rapide) + frigo (+/âˆ’).
- **iOS** : WidgetKit Swift â€” lecture + deep link (`@bacons/apple-targets`).
- **Doc** : `docs/widgets.md`.

### Plan repas â€” semaines enregistrÃ©es
- **Enregistrer** une semaine de repas (titre optionnel) depuis l'Ã©cran Â« Semaine Â».
- **BibliothÃ¨que** : filtre par mois ou favoris â˜…, aperÃ§u des recettes.
- **RÃ©appliquer** sur la semaine en cours (+ option Â« manquants â†’ courses Â»).
- **API** : `MealPlanWeekSnapshot` + routes `/api/meal-plan/snapshots/*`.
- **Migration** : `pnpm prisma:db-push` requis.

### Recettes â€” guides pas Ã  pas (29 core)
- **ModÃ¨le** : `Recipe.guideJson` + types `RecipeGuide` (ustensiles, Ã©tapes titre/texte/durÃ©e/astuce).
- **Contenu** : `recipe.guides.ts` â€” 29 recettes core rÃ©Ã©crites en tutoriel sÃ©quentiel.
- **UI** : `RecipeStepper` enrichi (matÃ©riel, chips ustensiles, astuces).
- **Migration** : `pnpm prisma:db-push` + `pnpm prisma:seed`.


## [1.1.0] - 2026-06-21

Version stable V2 avant refonte graphique. Tag : `v1.1.0`, branche de secours : `release/v1.1`.

### v2 â€” Carte magasin (polish)
- **Carte plein slot** : `fitViewBoxToViewport` â€” plus de bandes vides / plan miniature sur web.
- **Rendu carto** : couloirs crÃ¨me, gondoles au mÃ¨tre, Ã®lots allÃ©e transparents, Ã©chelle 1 m / 5 m.
- **UX** : centrage â—Ž (barre + flottant), fiche `!` magasin inconnu, sÃ©lecteur plan retirÃ© de lâ€™Ã©cran principal.
- **Tests** : `store-map-viewport.test.ts` (3).

### v2 â€” mode magasin (fondation)
- **RLS Supabase** : script `supabase/rls/001_enable_rls.sql` + `pnpm rls:apply` â€” tables protÃ©gÃ©es, email/token isolÃ©s.
- **Package `@homeshared/store-navigation`** : layouts 2D, calcul de route par rayons, tests.
- **Mode magasin** : bouton Â« Je suis au magasin Â», plan schÃ©matique SVG, parcours rayon par rayon.
- **Optimistic UI** : cocher article sans attendre le rÃ©seau (`useOptimisticPurchase`).

### v2 â€” PDR + contributions communautaires
- **BDD** : modÃ¨les `StoreContributionBatch`, `StoreContributionEvent`, `ContributorTrust`.
- **API** : `GET/POST /api/stores/contributions` â€” agrÃ©gats pondÃ©rÃ©s, dÃ©tection magasin pionnier, rate limits batch.
- **Mobile** : `usePdrSession` (podomÃ¨tre), `useContributionDraft`, `useStoreSession`, bandeau pionnier, long-press recalage, signalement rupture.

### v2 â€” Perf (bloc 6)
- **Cache local** : `lib/local-cache/` â€” contributions 15 min, Overpass 24 h, layout 7 j.
- **Snapshot mode magasin** : liste figÃ©e Ã  l'entrÃ©e, zÃ©ro refetch shopping pendant la session.
- **Invalidations ciblÃ©es** : debounce 2 s fridge/recipes hors mode magasin ; realtime suspendu en magasin.
- **API** : `Cache-Control` sur agrÃ©gats contributions.

### v2 â€” Bloc 3 gÃ©oloc magasin
- **GPS** : permission foreground `expo-location` au lancement mode magasin.
- **Overpass** : POI `shop=supermarket|convenience|grocery` dans 500 m, cache local 24 h.
- **Choix magasin** : sheet avec liste, auto-sÃ©lection si un seul POI â‰¤ 80 m, reprise dernier magasin.
- **Profil layout** : heuristique enseigne OSM â†’ hyper / super / proxi.
- **Session** : `storeOsmId` rÃ©el + coordonnÃ©es entrÃ©e pour contributions communautaires.

### v2 â€” Maps de base auto (GPS â†’ type magasin)
- **DÃ©tection enrichie** : `inferLayoutProfileDetailed` (Carrefour Market/City, Lidl, Monoprix, Super U, etc.) + niveau de confiance.
- **MÃ©tadonnÃ©es plans** : `getLayoutProfileMeta` â€” description et parcours type par profil.
- **AperÃ§us visuels** : miniatures SVG hyper/super/proxi dans le picker et le switcher.
- **Switcher en session** : ajuster le plan si la dÃ©tection est incorrecte (persistÃ© par magasin).
- **Auto-pick amÃ©liorÃ©** : sÃ©lection du plus proche si â‰¤ 80 m ou clairement devant le 2e candidat.
- **Carte enrichie** : badge type sur le plan, pins orange des emplacements communautaires.
- **UX test** : changer de magasin depuis le mode magasin, coords GPS affichÃ©es, confirmation envoi contributions.

### CorrigÃ© (v2 stabilisation)
- **PDR** : dÃ©pendances React stabilisÃ©es (`recalibrate` au lieu de lâ€™objet `pdr` entier) â€” plus de boucle de recalage.
- **CI locale** : `scripts/verify-local.mjs` + `pnpm verify` fiables sous Windows.
- **Tests** : +8 tests (PDR polyline, productFingerprint, contributions service).
- **RLS Supabase v2** : `002_v2_contributions_rls.sql` + `003_auth_initplan.sql` ; `pnpm rls:apply` exÃ©cute les 3 scripts.

### AjoutÃ© (publication web + Play Store)
- **Guide dÃ©ploiement** : `docs/DEPLOYMENT.md` (API Fly.io, site Vercel, Play Store EAS).
- **API Docker** : `Dockerfile` + `fly.toml` pour hÃ©bergement production.
- **Web PWA** : `vercel.json`, manifest, service worker, icÃ´nes, page `/download`.
- **Play Store** : descriptions FR/EN, icÃ´ne 512, profil EAS submit.

### AjoutÃ© (v1 â€” lÃ©gal & sync)
- **Sync temps rÃ©el** : hook `useGroupRealtime` (courses, frigo, planning, tÃ¢ches, chat) + doc `docs/REALTIME-SETUP.md`.
- **RGPD** : `DELETE /api/users/me`, UI suppression compte profil, politique confidentialitÃ© `/privacy`.
- **Consentement pubs** : UMP Google via `@tech-bricks/ads` v0.2 (`requestAdsConsent`, prÃ©fÃ©rences profil Android).
- **Templates lÃ©gaux** : `templates/legal/privacy-policy.fr.md` + `.en.md`.
- **Checklist E2E** : `docs/E2E-CHECKLIST.md`.

### SÃ©curitÃ© & contenu recettes
- Validateur catalogue : tempÃ©ratures viande/poisson, anti-placeholders, unitÃ©s Å“ufs.
- 31+ recettes : instructions exploitables, nems (prÃ©-cuisson), pho bÅ“uf, brochettes 74 Â°C.
- Scripts `pnpm recipes:patch`, `pnpm recipes:audit`.

### AmÃ©liorÃ© (perf)
- Matching frigo : une recette = une requÃªte DB ; filtre cuisine sur le catalogue.
- Index `MealPlanEntry(groupId, cookedAt)` pour rÃ©servations planning.

### AmÃ©liorÃ© (UX)
- Accueil : libellÃ©s sous les espaces / groupes du carrousel.
- Fiche groupe : bandeau rÃ©sumÃ© (courses en attente, produits frigo, repas planifiÃ©s).
- Planning : navigation entre semaines, mise en avant du jour courant, % frigo colorÃ©s.
- Frigo : tri par urgence DLC, pull-to-refresh, accÃ¨s planning depuis les rÃ©servations.

### AjoutÃ©
- **Droits repas groupe** : titulaire configure qui voit / choisit les crÃ©neaux (VIEW, EDIT_SLOT, EDIT_ALL), rÃ¨gles auto Â« qui cuisine quand Â», heures repas.
- **Sync repas â†’ tÃ¢ches** : crÃ©ation auto tÃ¢ches prÃ©paration/cuisson avec rappel Ã  l'heure du repas (si activÃ©).
- **Recettes mobile** : navigation par tuiles, super-catÃ©gories, filtres rapides, portions au stepper.
- **Mode enfant** : compte ou membre marquÃ© enfant â†’ actions sensibles masquÃ©es (courses, tÃ¢ches, gestion groupe).
- **Checkout courses** : tout au caddie, valider aprÃ¨s paiement (vide liste, frigo dÃ©jÃ  rempli).
- **Export liste** : partage texte pour drive en ligne (ADR-003).
- **Recettes favorites** + tri prioritaire dans matching frigo.
- **Ajouter ingrÃ©dients manquants** d'une recette Ã  la liste de courses.
- **TÃ¢ches maison** : module groupe TASKS (unique/quotidienne/hebdo/mensuelle, prise en charge par membre).
- **Profil utilisateur** : bio, stats groupes/favoris, Ã©cran profil.
- **Saison & jardin** : calendrier France enrichi (~45 entrÃ©es chacun).
- **9 recettes** supplÃ©mentaires avec instructions dÃ©taillÃ©es (28 total).
- **Catalogue massif** : 231 recettes (salades â†’ rouleaux de printemps â†’ desserts), +58 ingrÃ©dients, script `pnpm recipes:generate`.
- Scripts racine `pnpm prisma:db-push` / `pnpm prisma:seed` (Ã©vite l'erreur Â« prisma not found Â»).
- Avatars membres sur Ã©cran accueil groupe.

### AjoutÃ© (sessions prÃ©cÃ©dentes)
- Hub accueil avec modules perso (saison, jardin, magasins, catalogue recettes).
- Recettes mode Ã©tape par Ã©tape (`RecipeStepper`) + bascule texte brut.
- IcÃ´nes catÃ©gorie ingrÃ©dients (`IngredientAvatar`) sur courses et recettes.
- API `GET /api/tools/season`, `GET /api/tools/garden` (donnÃ©es France).
- API magasins mock : suggest + comparateur de prix (`/api/stores/*`).
- Lien courses â†’ magasins (voir en magasin + comparer la liste).
- Chat de groupe (`GroupMessage`, panneau latÃ©ral modal).
- 6 recettes supplÃ©mentaires (19 au total aprÃ¨s seed).
- Checklist de tests modulaires : `docs/FEATURES.md`.

### OptimisÃ© (infra & perf)
- Scores frigo du planning repas en batch (3 requÃªtes DB / semaine au lieu de N).
- Cache catalogue ingrÃ©dients 5 min pour lâ€™Ã©cran frigo.
- Typecheck mobile : client `api.put`, gÃ©nÃ©riques React Query.
- Cache auth API 5 min (0 SQL si cache hit vs 4â€“5 requÃªtes/requÃªte).
- Sync user : `findUnique` rapide au lieu d'`upsert` systÃ©matique.
- Reconnexion Prisma auto (`withPrismaReconnect`) sur ConnectionReset.
- Logs `prisma:query` dÃ©sactivÃ©s sauf `PRISMA_LOG_QUERIES=1`.
- `GET /health/db` avec hint si DB down.
- Cache mobile 24h catalogues statiques (saison/jardin).
- Message clair si API injoignable (fetch fail).
- `DIRECT_DATABASE_URL` + guide `docs/SETUP-STEVE.md`.

### CorrigÃ© (session tests)
- Imports API `tools.routes` / `stores.routes` (chemin prisma corrigÃ© â€” lâ€™API ne dÃ©marrait pas).
- Suggestions magasin par article : une requÃªte par ligne (plus de mÃ©lange).
- Comparateur : auto-lancement depuis liste de courses.

### Tests automatisÃ©s
- `scripts/test-features-api.mjs` â†’ 12/12 OK
- Vitest API â†’ 15/15 OK

### CorrigÃ©
- Ajout liste de courses : `groupId` manquant sur onglets Expo (web) â†’ `useGroupId()`.
- Frigo : formulaire dâ€™ajout manuel cÃ´tÃ© mobile.

### AjoutÃ©
- Espace personnel Â« Mon espace Â» (auto-crÃ©Ã©, `isPersonal`).
- Modules par groupe (`features` : SHOPPING, FRIDGE, RECIPES) + toggles propriÃ©taire.
- Suppression de groupe (`DELETE /api/groups/:id`).
- Onglets conditionnels selon modules actifs.

### CorrigÃ© (session prÃ©cÃ©dente)
- Auth web : `localStorage` pour Supabase (plus AsyncStorage sur RN Web).
- Inscription : retry `signInWithPassword` si pas de session aprÃ¨s `signUp`.
- Messages FR pour Â« Failed to fetch Â» et config manquante (`DevConfigWarning`).
- `app.config.js` + `dotenv` : injection fiable des `EXPO_PUBLIC_*` dans `expo-constants`.
- NativeWind dark mode web (`darkMode: 'class'`, `nativewind-setup.ts`).
- Metro monorepo pnpm : deps manquantes + rÃ©solution `.ts` pour `@homeshared/shared`.
- API auth : collision `username` unique Ã  la sync Prisma (fallback `user_<id>`).
- Scripts : `test-supabase-auth.mjs`, `smoke-stack.ps1` (smoke E2E signup + `/api/groups`).

### AjoutÃ©
- **Catalogue d'ingrÃ©dients** : table `Ingredient` (slug, catÃ©gorie, aliases FR), 49 ingrÃ©dients + 13 recettes seedÃ©es.
- API `GET /api/ingredients` et `GET /api/ingredients/:slug` (liste + dÃ©tail avec recettes liÃ©es).
- Matching recettes amÃ©liorÃ© : normalisation accents/ligatures (Å“â†’oe) + aliases (Â« Å“ufs Â» matche `oeuf`).
- ADR `docs/adr/002-catalogue-ingredients-normalises.md`.
- Scripts `prisma:migrate-catalog`, `prisma:db-push`.
- Tests unitaires API : `group.service`, `recipe-matching.service`, `fridge.service` (7 tests Vitest).
- Ã‰cran mobile Â« Rejoindre un groupe Â» (`app/(app)/join.tsx`) + partage dâ€™invitation native.
- Composants UX : `LoadingCenter`, `EmptyState`, hook `useMutationError`, banniÃ¨re pub placeholder.
- Suppression dâ€™articles sur la liste de courses (appui long).
- ClÃ©s i18n `invite.*` et messages de suppression courses.
- Scaffold initial du monorepo pnpm (`apps/api`, `apps/mobile`, `packages/shared`).
- API Fastify + Prisma + PostgreSQL :
  - SchÃ©ma complet (User, Group, Membership, Invite, ShoppingItem, FridgeItem, Recipe, RecipeIngredient).
  - Routes : auth/me, users, groups (CRUD + invitations), shopping (avec promotion auto au frigo), fridge, recipes (catalogue + matching).
  - Algorithme de matching recettes â†” frigo avec score.
  - Plugin auth Supabase + synchronisation lazy des utilisateurs.
  - Error handler centralisÃ© + erreurs typÃ©es.
- App mobile Expo + RN Web :
  - Expo Router (file-based), NativeWind, i18next (FR + EN), TanStack Query, Zustand.
  - Ã‰crans : login, signup, home (liste groupes), crÃ©ation groupe, dÃ©tail groupe, courses, frigo, recettes.
  - Composants UI : `Screen`, `Button`, `Input`.
  - Manifest PWA installable iOS.
- Package `@homeshared/shared` : types + schemas Zod + erreurs.
- Configuration : Prettier, EditorConfig, `.nvmrc`, `.env.example`.
- Briques tech-bricks crÃ©Ã©es :
  - `@tech-bricks/auth-supabase` v0.1.0
  - `@tech-bricks/ads` v0.1.0 (stub)

## [1.0.0] - 2026-06-10

PremiÃ¨re version produit validÃ©e (courses, frigo, recettes, planning, tÃ¢ches, dÃ©ploiement web + APK).
Tag : `v1.0.0`, branche figÃ©e : `release/v1.0` (commit `ad535c5`).
