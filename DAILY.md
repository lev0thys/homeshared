# Daily Log — homeshared

## 📌 État actuel

- **Version** : 1.1.0 — Expo **SDK 53**, target **API 35**
- **Android AAB local** : ✅ compilé (`apps/mobile/build.aab`, ~40 Mo) — signature **debug** (Play → keystore EAS requis)
- **EAS cloud Android** : quota Free épuisé (reset ~1er août 2026)
- **iOS EAS** : credentials Apple **non configurés** (1× interactif requis)
- **Prochaine étape Steve** : `scripts/setup-android-release-signing.ps1` puis re-sign / `scripts/build-ios-eas.ps1`

---

## 2026-07-05 (suite) — Builds locaux Android OK

### Fait
- [x] SDK Android 35 installé (`scripts/setup-android-sdk.ps1`)
- [x] Build Gradle `bundleRelease` Windows — API 35, SDK 53, widgets prod off
- [x] Fix monorepo Metro/Gradle : `extraPackagerArgs` entry `apps/mobile/index.js`, plugin `withMonorepoAndroidGradle.js`
- [x] AAB : `apps/mobile/build.aab` + `play-store/homeshared-production-api35.aab`
- [x] Workflow GHA `eas-build-android-local.yml` (Gradle Linux, sans quota)
- [x] Scripts : `build-android-aab-local.ps1`, `build-ios-eas.ps1`, `setup-android-release-signing.ps1`

### Bloqueurs
- [ ] AAB signé **debug** — Play exige keystore EAS (download via `eas credentials`)
- [ ] iOS : `eas build -p ios` en mode **interactif** (certificats + widget extension)

---

## 2026-07-05 — Boucle EAS automatisée + SDK 53

### Fait
- [x] `scripts/eas-build-loop.mjs` — build → surveille → diagnostique → fix → retry
- [x] `scripts/eas-build-diagnose.mjs` + `scripts/eas-build-fixes.mjs`
- [x] `pnpm eas:build:loop` dans package.json racine
- [x] Upgrade auto Expo 51 → 52 → 53 (deps alignées)
- [x] Fix `match.tsx` (import cassé → bundle JS OK local)
- [x] `app.config.js` : SDK 53 → API 35 native + Kotlin 2.0.21
- [x] Règle 96-play-store-playbook : surveillance obligatoire

### Bloqueur
- [ ] **Quota EAS Free** Android atteint — plus de builds ce mois

---

## 2026-07-02 — Scope v1 complet + rebuild widgets

### Fait
- [x] Scope v1 : widgets, App Store iOS, OAuth, E2E intégrés (`PROJECT.md`, `BACKLOG.md`)
- [x] Widget Android : pin `react-native-android-widget@0.14.2` (compatible Expo 51)
- [x] `eas.json` : profils iOS preview/production ; widgets réactivés (plus `EXPO_NO_ANDROID_WIDGETS`)
- [x] `docs/APP-STORE-IOS.md`, E2E §8–10, `STEVE-TODO` étapes 13–15
- [x] `app.config.js` : `ios.appleTeamId` via `EXPO_APPLE_TEAM_ID`
- [x] EAS build preview Android **avec widgets** lancé : `13192030-846c-4d86-a24f-7c6b8bb7cae8`

### Steve (reste)
- [ ] OAuth : Supabase provider Google + Google Cloud client (code déjà livré)
- [ ] `EXPO_APPLE_TEAM_ID` pour build iOS
- [ ] E2E checklist 2 comptes
- [ ] Play + App Store publication

---

## 2026-06-29 — Préparation publication (agent)

### Fait
- [x] `pnpm prisma:db-push` + `prisma:seed` OK
- [x] `pnpm rls:apply` (001, 002, 003)
- [x] `pnpm verify` vert — fix `match.tsx` (GroupNutritionSummary), test `shopping-commit` (mock ingredient)
- [x] `fly deploy` + `deploy:fly-secrets` — API prod à jour
- [x] EAS : `EXPO_PUBLIC_ADMOB_REWARDED_ID` ajouté (preview + production)
- [x] `pnpm build:web` export OK
- [x] `export/CHECKLIST-LANCEMENT.md` mis à jour

### Steve (reste)
- [ ] Realtime 5 tables + OAuth redirects Supabase
- [ ] `eas build --profile preview --platform android`
- [ ] E2E `docs/E2E-CHECKLIST.md`
- [ ] Play Console tests internes + captures
- [ ] Redéployer Vercel si besoin (dashboard)

---

## 2026-05-28 — Stabilisation complète (typecheck + dev)

### Fait
- [x] `pnpm dev:stop` + `pnpm install` + `prisma generate` OK
- [x] **Mobile `typecheck` vert** (0 erreur) — meal-plan, match, widgets, hooks, tests
- [x] **API `typecheck` vert**
- [x] Tests mobile (14) + shared nutrition/notifications (13) verts
- [x] `useMutationError.captureError` helper + `onError` mutations corrigés
- [x] Dev relancé : API `:3001` + Metro `:8081`

---

### Fait
- [x] `@homeshared/shared` : `notification-preferences.ts` + tests (master, tâches, repas hebdo, frigo/courses v2)
- [x] Prisma `User.notificationPrefs` + API `PATCH/GET /api/users/me`
- [x] API `GET /api/tasks/me/reminders` — sync rappels tâches claim/assignées
- [x] Mobile : `expo-notifications` + `expo-device`, scheduler local, bootstrap `_layout.tsx`
- [x] Profil : section « Notifications » (`NotificationSettingsEditor`)
- [x] Tâches : invalidation sync après claim/complete/schedule
- [x] i18n FR/EN `notifications.*`

### Steve
- [x] `pnpm prisma:db-push` (colonne `notificationPrefs`) — fait en audit
- [ ] Redémarrer dev : `pnpm dev:stop` puis `dev:api` + `dev:mobile`
- [ ] Rebuild dev client Android si besoin — plugin notifications
- [ ] Tester sur téléphone réel

---

## 2026-05-28 — Audit qualité & stabilité

### Fait
- [x] Notifications : stubs `.web.ts` / `.native.ts` — web ne crash plus
- [x] TS API vert (`typecheck`) : snapshots, seed, nutrition, archives
- [x] TS shared : `ingredient-macros.ts`, emojis fallback
- [x] `DriveImportWebViewModal.tsx` shim, warning Expo AdMob nettoyé
- [x] Hub favoris ★/☆

### Bloqueur
- `prisma generate` EPERM tant que l’API dev tourne → redémarrer après `dev:stop`

---

## 2026-05-28 — Nutrition profil & recettes

### Fait
- [x] Schéma Prisma : `User` (heightCm, weightKg, birthYear, sex, activityLevel, nutritionGoal, nutritionConsentAt) + `Recipe.nutritionPerServing`
- [x] `@homeshared/shared` : BMR/TDEE Mifflin-St Jeor, estimation nutrition ingrédients (CIQUAL), tests
- [x] API : `PATCH /api/users/me` nutrition, `GET /api/groups/:id/nutrition-summary`, kcal dans match + détail recette
- [x] Seed : calcul automatique `nutritionPerServing` pour tout le catalogue
- [x] Mobile : section Nutrition profil, badge kcal recettes, panneau macros, bannière besoins foyer
- [x] Portions match : initialisation depuis membres du groupe (adultes + enfants × 0,65)

### Steve
- [ ] `pnpm prisma:db-push` + `pnpm prisma:seed`

---

## 2026-05-28 — Widgets iOS (WidgetKit)

### Fait
- [x] `@bacons/apple-targets@0.2.1` + App Group `group.com.steve.homeshared`
- [x] Extension Swift `targets/homeshared-widgets/` (Courses + Frigo)
- [x] Bridge iOS `widget-ios-bridge.ts` — miroir JSON vers App Group
- [x] `useWidgetBridge` étendu à iOS
- [x] Doc unifiée `docs/widgets.md`

### En cours / Steve
- [ ] EAS build iOS (`eas build --platform ios`) — nécessite Mac cloud EAS + compte Apple Developer
- [ ] Activer App Group sur Apple Developer Portal si EAS le demande

---

## 2026-05-28 — Widgets Android (Courses + Frigo)

### Fait
- [x] Dépendance `react-native-android-widget@0.16.1` + plugin Expo (`app.config.js`)
- [x] Point d'entrée `index.js` + task handler headless
- [x] Bridge : `src/widgets/` (storage, API, sync, snapshots)
- [x] Widgets `HomesharedShopping` + `HomesharedFridge` (interactifs)
- [x] Hook `useWidgetBridge` sur layout groupe
- [x] Doc `docs/android-widgets.md` + tests snapshot

### En cours / Steve
- [ ] `pnpm install` (si lockfile OK) puis `eas build --profile development --platform android`
- [ ] Ajouter widgets sur écran d'accueil et valider cocher / +− / deep links

---

## 2026-05-28 — Semaines de repas enregistrées

### Fait
- [x] Modèles Prisma `MealPlanWeekSnapshot` + `MealPlanSnapshotEntry`
- [x] API : liste (mois / favoris), création, favori, suppression, réapplication + courses
- [x] UI : panneau « Semaines enregistrées » sur `recipes/meal-plan.tsx`
- [x] i18n FR + EN (section snapshots)

### En cours / Steve
- [ ] `pnpm prisma:db-push` puis redeploy API Fly

---

## 2026-06-21 — Release v1.1 + structure expérimentations UI

### Fait
- [x] Tag **`v1.0.0`** sur `ad535c5` (v1 validée) + branche **`release/v1.0`**
- [x] Tag **`v1.1.0`** sur HEAD (V2 mode magasin, invites, caddie/frigo) + branche **`release/v1.1`**
- [x] Branches **`commit`** et **`main`** alignées sur v1.1
- [x] Branche **`experiment/ui`** pour refonte visuelle / navigation
- [x] Bump semver `1.1.0` (root, api, mobile, shared, store-navigation)
- [x] Doc **`docs/UI-EXPERIMENTS.md`**

### Prochaine session
- [ ] Créer `experiment/ui-a` (première direction graphique)
- [ ] `fly deploy` API si besoin (contributions + commit-cart)

---

## 2026-05-28 (reprise) — Carte : fix affichage + polish

### Fait
- [x] **`fitViewBoxToViewport`** — la carte remplit 100 % du slot (plus de plan miniature centré avec bandes vides)
- [x] **`preserveAspectRatio="none"`** + viewBox ajusté au ratio écran
- [x] **Bouton ◎** aussi dans la barre d’outils + flottant
- [x] **Échelle dynamique** 1 m / 5 m selon zoom ; îlots allée plus transparents
- [x] **`store-map-viewport.test.ts`** — 3 tests
- [x] `pnpm verify` vert

### À tester
- [ ] Web mode magasin : carte remplit la zone grise, centrage ◎, zoom %
- [ ] Changer hyper → super → proxi via fiche `!` magasin inconnu

---

## 2026-05-28 (suite 6) — Maps GPS auto + polish testable

### Fait
- [x] **`inferLayoutProfileDetailed`** — enseignes FR (Leclerc, Carrefour Market/City, Lidl, Monoprix, Super U…) + confiance high/medium/low
- [x] **`layout-profile-meta.ts`** — libellés FR, emoji, description par type hyper/super/proxi
- [x] **`StoreLayoutPreview`** — miniatures plan dans le picker magasin
- [x] **`StoreLayoutSwitcher`** — changer le plan en cours de session (mémorisé par `storeOsmId`)
- [x] **`resolve-store-layout.ts`** — fusion détection OSM + override utilisateur en cache
- [x] **Auto-pick GPS** — magasin le plus proche si ≤ 80 m ou nettement plus proche que le 2e (≤ 150 m)
- [x] **`StoreMap2D`** — badge type magasin + pins orange contributions communautaires
- [x] **store-mode** — « Changer de magasin », coords GPS entrée, toast contributions envoyées
- [x] `pnpm verify` vert (11 tests store-navigation)

### À tester (Steve)
- [ ] Expo Go / web : « Je suis au magasin » → liste POI avec aperçu plan + type suggéré
- [ ] Vérifier switch hyper ↔ super ↔ proxi recalcule la route
- [ ] Long-press recalage + cocher articles → fin courses → alerte contributions
- [ ] Rebuild APK si permission GPS native pas encore dans le build actuel

---

## 2026-05-28 (suite 5) — Bloc 6 perf v2

### Fait
- [x] **`lib/local-cache/`** — TTL AsyncStorage + clés contributions / overpass / layout
- [x] **`useCachedQuery`** — contributions 15 min sans refetch systématique
- [x] **`store-mode.store`** — snapshot liste courses à l'entrée mode magasin
- [x] **`useOptimisticPurchase`** — mode magasin : 0 invalidation ; liste classique : fridge/recipes **debounce 2 s**
- [x] **`useGroupRealtime`** — pause invalidations pendant mode magasin
- [x] API `GET /contributions` → header `Cache-Control: max-age=600`
- [x] `pnpm verify` vert

### Prochaine étape v2
- [ ] Pub rewarded opt-in fin courses
- [ ] `fly deploy` API contributions prod
- [ ] Test device hyper réel

### Décision Steve (2026-05-28)
- **Compte Apple Developer 1 an** — anticipation uniquement ; **fiches Play / App Store plus tard**, quand la version sera bien affinée (pas maintenant).

---

### Fait
- [x] **`expo-location`** + permission foreground (`app.json` plugin)
- [x] **Overpass mobile** — `fetchNearbyStoresFromOverpass` (cache 24 h, rayon 500 m)
- [x] **`inferLayoutProfileFromOsmTags`** dans `@homeshared/store-navigation` + tests
- [x] **`StorePickerSheet`** — liste POI, dernier magasin, fallback plan hyper/super/proxi
- [x] **`useStartStoreMode`** — auto-pick si 1 magasin ≤ 80 m, sinon sheet
- [x] **`beginSession`** — persiste `storeOsmId`, nom, layout, `entryLat/Lng`
- [x] Mode magasin affiche le nom du magasin + plan suggéré
- [x] **69 tests** verify vert

### Prochaine étape v2
- [ ] Cache local perf (`useStoreModeQueryPolicy`)
- [ ] Pub rewarded fin courses
- [ ] `fly deploy` API (contributions prod)
- [ ] Test device réel en hyper (GPS + Overpass)

### Note
- **Rebuild EAS/APK** requis pour la permission localisation native (plugin `expo-location`).

---

### Fait
- [x] **4× `pnpm verify` vert** — 60 tests API + 5 store-navigation + typecheck 4 packages
- [x] Script **`scripts/verify-local.mjs`** — contourne symlinks `node_modules` Windows cassés
- [x] **Bugfix** : dépendances `usePdrSession` / recalage rayon (évite re-render loop)
- [x] **`advanceAlongPolyline`** extrait dans `@homeshared/store-navigation` + 3 tests PDR
- [x] **`productFingerprint`** déplacé dans `@homeshared/shared` + 2 tests
- [x] **6 tests** `store-contributions.service` (agrégats, pioneer, submit mock)
- [x] **RLS v2** : scripts `002_v2_contributions_rls.sql` + `003_auth_initplan.sql` appliqués (`pnpm rls:apply` OK)

### Commande locale fiable
```powershell
pnpm verify
# ou : node scripts/verify-local.mjs
```

### Prochaine étape v2
- [ ] Géoloc Overpass + déployer API Fly (contributions prod)
- [ ] Cache local perf + pub rewarded

---

### Fait
- [x] **Prisma** : `StoreContributionBatch`, `StoreContributionEvent`, `ContributorTrust` — `db push` OK sur Supabase
- [x] **API** : `GET /api/stores/contributions`, `POST /api/stores/contributions/batch` + service agrégation + cache TTL + `ContributorTrust`
- [x] **`usePdrSession`** — podomètre accéléromètre (`expo-sensors`), déplacement le long du polyline
- [x] **`useContributionDraft`** — brouillon local FOUND / POSITION_FIX / OUT_OF_STOCK / LAYOUT_FEEDBACK → envoi batch à « Courses terminées »
- [x] **`useStoreSession`** — magasin + profil layout en AsyncStorage (`storeOsmId` défaut `0`)
- [x] **`PioneerStoreBanner`** — bandeau pionnier + badge communauté
- [x] **Plan 2D** : long-press « Je suis ici », signalement rupture 🚫 par article
- [x] i18n FR/EN étendu `storeMode.*`

### En cours (v2 restant)
- [ ] Géoloc magasin (Overpass mobile + choix POI)
- [ ] Cache local / `useStoreModeQueryPolicy` (perf §5.4)
- [ ] Pub rewarded opt-in fin courses
- [ ] Rapports métriques CI : secret `DIRECT_DATABASE_URL` sur GitHub

### Bloqueurs
- ~~Alertes CRITICAL RLS sur tables v2~~ → **`pnpm rls:apply`** ré-exécuté (002 + 003) le 2026-05-28
- Vérifier dashboard Supabase Security après refresh (4 CRITICAL + 5 WARN initplan attendus résolus)

---

## 2026-05-28 (suite) — RLS Supabase + fondation v2 mode magasin

### Fait
- [x] **RLS Supabase appliqué** — `pnpm rls:apply` → script `supabase/rls/001_enable_rls.sql` exécuté sur la base prod/dev
- [x] Package **`@homeshared/store-navigation`** : layouts hyper/super/proxi, `buildStoreRoute`, tests vitest
- [x] **`useOptimisticPurchase`** — cocher instantané (liste courses + mode magasin)
- [x] **Mode magasin v2 (MVP)** : CTA « Je suis au magasin », écran `store-mode.tsx`, plan 2D SVG (`StoreMap2D`), parcours par rayons
- [x] i18n FR/EN `storeMode.*`

### Bloqueurs
- Vérifier dashboard Supabase Security → alertes CRITICAL disparues après RLS

---

## 2026-05-28 (jeudi) — Spec technique GPS magasin

### Fait
- [x] **ADR-006** — navigation hybride rayons + PDR + crowdsourcing (`docs/adr/006-navigation-magasin-hybride.md`)
- [x] **Plan d'implémentation** détaillé : package `@homeshared/store-navigation`, écrans `store-mode/`, modèle Prisma `Store` / `ShoppingTrip` / `AisleContribution`, endpoints, phases v2.0→v2.3 (`docs/V2-GPS-IMPLEMENTATION.md`)
- [x] `BACKLOG.md` — lien vers la spec sur la phase v2.0

### Décisions
- [x] **Tout dans la v2** — pas de sous-releases v2.0/v2.1 ; client-first, BDD minimale (contributions Waze seule migration notable)
- [x] **UX** : plan 2D + batch contributions à validation + recalage manuel + signalements rupture/mauvais emplacement + score confiance interne
- [x] **Perf v2** : cache local, snapshot mode magasin, invalidations ciblées, anti-spam API (spec §5.4)

### Fait (2026-05-28 suite)
- [x] **Rapports métriques hebdo** : `apps/api/scripts/weekly-metrics.ts`, `pnpm metrics:weekly`, workflow `weekly-metrics.yml` (lundis), `docs/METRICS-WEEKLY.md`

### En cours
- [ ] **v2 GPS magasin** : fondation → magasin → capteurs → Waze (ordre dev interne)
- [ ] **CI métriques** : configurer secret GitHub `DIRECT_DATABASE_URL` pour rapports auto

---

## 2026-06-09 (deploy prod web + APK Vercel)

### Fait
- [x] Script `scripts/fetch-apk-for-vercel.mjs` — télécharge l'APK EAS au build Vercel (~81 Mo)
- [x] `vercel.json` buildCommand mis à jour ; commit `32ae13a` + lockfile `51e2136` push `dev`
- [x] **Deploy Vercel prod** — alias https://homeshared.vercel.app (bundle `entry-72327849…`)
- [x] `/download.apk` servi depuis Vercel ; page `/download` + login web opérationnels

---

## 2026-06-09 (suite — Fly deploy + fix Gradle EAS)

### Fait
- [x] **`fly deploy`** — API prod avec rate limiting actif (`/health/db` OK)
- [x] Diagnostic Gradle build `35d9cedd` : dossier `apps/mobile/android` (prebuild local) **inclus dans l’archive EAS** → conflit Gradle
- [x] Fix : `homeshared/.easignore` + `apps/mobile/.easignore` excluent `apps/mobile/android` ; archive validée (api présent, android absent)
- [x] Build relancé `a337dfa9` (15 Mo, plus de warning « android directory detected »)

### En cours
- [ ] Build EAS `cfba3e90` (file) → si vert : APK + `copy-apk.ps1` + Vercel `/download`
- [x] Script **`node scripts/eas-preflight.mjs`** — valide config AdMob, archive, prebuild **avant** chaque `eas build` (évite builds cloud inutiles)

---

## 2026-06-09 (EAS archive + anti-spam API)

### Fait
- [x] **Cause racine EAS « Install dependencies »** : `.easignore` **racine** excluait `apps/api` alors que le workspace pnpm le requiert → corrigé (`homeshared/.easignore` minimal)
- [x] Archive validée : `eas build:inspect` inclut `apps/api` ; `pnpm install --frozen-lockfile` OK sur snapshot
- [x] **Cause EAS « Pre-install hook »** : `corepack prepare pnpm@9.15.9` échoue (signature Corepack sur worker EAS) → hook **supprimé**, `eas.json` → `"pnpm": "9.15.5"` (version worker)
- [x] Build relancé : `35d9cedd-6a76-4d8c-b461-04f302376905`
- [x] **Rate limiting API** (local, à déployer) :
  - Global : 100 req/min/IP (`RATE_LIMIT_MAX`), `/health` exclu
  - Par route : création groupe 5/min, invites 10/min, chat 30/min, écritures 60/min, routes lourdes 15/min
  - Fichiers : `apps/api/src/constants/rate-limits.ts`, routes groups/chat/shopping/recipes/tasks/fridge/stores, `error-handler.ts` 429

### En cours
- [ ] Build EAS `35d9cedd` (file + Gradle ~15–30 min)

### Bloqueurs / Décisions
- **`fly deploy`** pour activer le rate limit en prod — à faire après validation ou sur demande Steve
- Toute la config EAS + rate limit **non commitée** sur `488d87b`

---

## 2026-06-08 (fix EAS monorepo — v2)

### Fait
- [x] Diagnostic : 9 builds échouaient en **Pre-install hook** (~30 s), pas pendant Gradle
- [x] v1 : hook simplifié → toujours en file d'attente / échecs historiques
- [x] v2 : **suppression totale** du script `eas-build-pre-install` (plus de phase pre-install)
- [x] `apps/mobile/eas.json` : `corepack: true` + **`pnpm: "9.15.9"`** (clé officielle EAS, pas `installCommand`)
- [x] `apps/mobile/package.json` : `packageManager: "pnpm@9.15.9"`
- [x] `apps/mobile/.easignore` : exclut `.eas-check*`, `apps/mobile/dist`, garde lockfiles pnpm
- [x] Build relancé : `4f974206-bd8e-4c2d-b5a1-a0f3eff10a4f` (archive 82 Mo — dossiers debug inclus, corrigé pour prochain build)

### Bloqueurs
- **File d'attente EAS** très longue (free tier) — le build peut rester `in queue` 30–60 min
- **`eas.json` + `packages/tech-bricks-ads` toujours non commités** → dis-moi si je commit/push
- Google OAuth web : redirects Supabase (`docs/AUTH-GOOGLE.md`)

---

## 2026-06-07 (publication — exécution agent)

### Fait
- [x] Install `flyctl` + `eas-cli` (machine agent)
- [x] Fly login OK (`hevol.it.game@gmail.com`) — **bloqué** : carte bancaire requise sur Fly
- [x] EAS login OK + `eas init` → projet `@lev0thy/homeshared`
- [x] Variables EAS prod/preview (`eas env:create`) — API URL, Supabase, AdMob, site
- [x] Scripts : `scripts/deploy-fly-secrets.ps1`, `deploy-eas-secrets.ps1`, `deploy-vercel-env.ps1`
- [x] Fix EAS monorepo : `@tech-bricks/ads` vendu dans `packages/tech-bricks-ads/` (hors repo GitHub avant)
- [x] `eas.json` : corepack + Node 22 ; hook `eas-build-pre-install: corepack enable`
- [x] Keystore Android généré sur Expo (cloud)

### Fait (session 2026-06-08)
- [x] Fly app `homeshared-api` créée + secrets + deploy OK
- [x] `https://homeshared-api.fly.dev/health/db` → OK
- [x] Fix Docker : OpenSSL Alpine + `.dockerignore` Windows
- [x] EAS projet `@lev0thy/homeshared` + env vars cloud
- [x] `@tech-bricks/ads` vendu dans `packages/tech-bricks-ads/`

### En cours / Steve
- [ ] **Vercel Hobby (gratuit)** — `npx vercel login` (pas besoin du Pro)
- [ ] EAS build APK preview (relance en cours)
- [ ] Supabase redirect URLs → ajouter domaine Vercel prod

### Steve — ordre recommandé
1. `fly deploy` + secrets Supabase (étape 1 DEPLOYMENT.md)
2. Vercel import repo, root `apps/mobile`, variables env (étape 2)
3. `eas build --profile production` → Play Console tests internes (étapes 3–4)

---

### Fait
- [x] Hook `useGroupRealtime` — invalidation TanStack Query (courses, frigo, planning, tâches, chat) dans `groups/[groupId]/_layout.tsx`
- [x] Doc `docs/REALTIME-SETUP.md` (activation tables Supabase + RLS)
- [x] API `DELETE /api/users/me` + service `delete-user.service.ts` + tests unitaires
- [x] Profil : suppression compte, liens légaux, préférences pubs Android
- [x] Écran `/privacy` + templates `templates/legal/`
- [x] `@tech-bricks/ads` v0.2 : `requestAdsConsent`, `showAdsPrivacyOptions` (UMP)
- [x] `ads-init.ts` : consentement UMP avant init AdMob en prod Android
- [x] Signup : lien politique confidentialité
- [x] Checklist E2E `docs/E2E-CHECKLIST.md`
- [x] `PROJECT.md`, `BACKLOG.md`, `CHANGELOG.md` mis à jour

### Steve (avant tag v1)
- [ ] Activer Realtime sur 5 tables Supabase
- [ ] Parcours E2E 2 comptes coché
- [ ] Déployer PWA Vercel (URL privacy publique)
- [ ] Build APK signé EAS

---

## 2026-05-28 (OAuth Google)

### Fait
- [x] Flux OAuth PKCE : `src/lib/google-auth.ts`, `oauth-redirect.ts`, écran `app/auth/callback.tsx`
- [x] Bouton **Continuer avec Google** sur login **et** signup (`GoogleAuthButton.tsx`)
- [x] Dépendances `expo-auth-session`, `expo-web-browser`, `expo-crypto`
- [x] API : profil Prisma depuis metadata Google (`resolveDisplayName`, `suggestUsernameFromMetadata`)
- [x] Doc `docs/AUTH-GOOGLE.md` + lien dans `SETUP-STEVE.md`
- [x] Tests API **41/41**, typecheck mobile OK

### Steve (obligatoire pour que Google marche)
- [ ] Supabase → Google provider ON + redirect URLs (voir `docs/AUTH-GOOGLE.md`)
- [ ] Google Cloud → OAuth client Web + redirect Supabase `.supabase.co/auth/v1/callback`
- [ ] Tester web `http://localhost:8081` login + inscription Google

---

## 2026-05-28 (audit recettes + perf API)

### Fait
- [x] Validateur recettes renforcé (`pnpm recipes:validate`) : sécurité viande/poisson, placeholders, unités œufs
- [x] **31 recettes** patchées (instructions réelles + nems/brochettes/pho/ceviche)
- [x] Core : César poulet, bolognaise, poulet moutarde — 71/74 °C
- [x] `matchSingleRecipeAgainstFridge` : 1 requête recette (plus 231)
- [x] Filtre `cuisine` sur `matchRecipesAgainstFridge`
- [x] Index Prisma `MealPlanEntry(groupId, cookedAt)`
- [x] `pnpm recipes:patch` / `pnpm recipes:audit` → `docs/audit-recettes-catalogue.md`

### Steve
- [ ] `pnpm prisma:db-push` puis `pnpm prisma:seed` pour appliquer recettes corrigées en base

---

## 2026-05-28 (audit UX client)

### Fait
- [x] Hub : noms sous icônes groupes, titre « Mes espaces »
- [x] Groupe : `GroupStatusStrip` (compteurs courses / frigo / repas cliquables)
- [x] Planning : navigation semaines, colonne Auj., scores frigo colorés
- [x] Frigo : tri DLC, pull-to-refresh, lien réservations → planning
- [x] Doc `docs/ux-audit-client.md` (benchmark + backlog P0–P2)

### Tests manuels
- [ ] Puces statut groupe + navigation
- [ ] Semaine précédente/suivante planning + badge Auj.

---

## 2026-05-28 (perf + typecheck mobile)

### Fait
- [x] Perf planning : `fridgeScoresForMealPlanEntries` (batch, fin du N+1 scores frigo)
- [x] Cache catalogue ingrédients 5 min (`getFridgeAvailability`)
- [x] Mobile : `api.put`, typecheck strict corrigé (useQuery + annotations)
- [x] Tests : +2 unitaires `fridge-availability` (37 total) ; E2E 18/18
- [x] Doc `docs/optimisations.md`

### Tests manuels suggérés
- [ ] Repas semaine : scores frigo cohérents après plusieurs créneaux planifiés
- [ ] Accueil / header / FAB groupe (inchangé vs session hub)

---

## 2026-05-28 (hub + frigo + tests)

### Fait
- [x] Frigo : réservations planning (stock physique − réservé), GET `/api/fridge` avec `items` + `reservations`
- [x] Hub : carrousels espaces, FAB « + » groupe, header icônes alignées (outils en haut)
- [x] Calendriers saison/jardin audités + correctifs données
- [x] Tests E2E étendus (`scripts/test-features-api.mjs`) : frigo, meal-plan, match, complete
- [x] Typecheck API OK ; fix `VALIDATION_ERROR` droits repas

### Tests manuels suggérés
- [ ] Accueil : swipe espaces, ★ favoris, FAB rejoindre / nouveau groupe
- [ ] Header : 🍂🌱🛒📖 → outils ; 🏠👤 en haut à droite
- [ ] Groupe → Repas semaine : planifier, score frigo, Repas fini → frigo baissé
- [ ] Frigo : bandeau réservé si repas planifié non cuisiné

---

## 2026-05-28 (recettes mobile + mode enfant)

### Fait
- [x] UI recettes refaite mobile : hub 4 tuiles, super-catégories, filtres rapides (Favoris/Rapide/Prêt frigo), stepper portions, cards unifiées
- [x] Composants `RecipeNavHub`, `SuperCategoryBar`, `CuisineFilterBar`, `RecipeListCard`, `ServingsStepper`
- [x] Mode enfant : `User.isChild` + `Membership.isChild`, signup avec toggle, titulaire marque un membre enfant
- [x] Hook `useUserCapabilities` — masque création groupe, ajout courses/tâches, export manquants recette
- [x] API `PATCH /api/groups/:groupId/members/:membershipId`
- [x] Tests API 29/29

### En cours / v2
- [ ] Compte enfant sans email (création 100 % par le parent)
- [ ] Matrice fine « action X visible si enfant » configurable par titulaire

---

### Fait
- [x] ADR `docs/adr/004-droits-groupe-repas-taches.md` (phase 1 acceptée)
- [x] Schéma Prisma : `GroupMealSettings`, `MemberMealGrant`, `MemberMealRule`, `MealPlanEntry` niveau groupe, `HouseholdTask.source` + `reminderAt`
- [x] Service `group-permissions.service.ts` : `canEditMealSlot`, config droits, règles auto cuisinier
- [x] `meal-plan.service.ts` : planning groupe, matrice `slots.canEdit`, sync tâches préparation/cuisson + rappel à l'heure repas
- [x] API `GET/PUT /api/groups/:groupId/meal-permissions`
- [x] Mobile : écran `meal-permissions.tsx` + créneaux lecture seule dans `meal-plan.tsx`
- [x] Tests unitaires droits (27 tests API OK)

### En cours / v2
- [ ] Notifications push aux rappels (`reminderAt`)
- [ ] UI règles auto plus riche (picker jour/créneau sur chaque règle)

---

### Étude & doc
- [x] ADR export drive : `docs/adr/003-export-drive-courses.md` (copier-coller + liens recherche, pas d'API panier)

### API / schéma
- [x] `RecipeFavorite`, `HouseholdTask`, `User.bio`
- [x] Module groupe `TASKS`
- [x] `POST /api/shopping/:groupId/finalize`, `purchase-all`
- [x] Favoris recettes + `POST /api/recipes/:id/shopping-missing`
- [x] Routes `/api/tasks/*`, `GET /api/users/me`

### Données
- [x] Saison ~45 produits, jardin ~45 tâches (12 mois France)
- [x] +9 recettes détaillées (28 total)

### Mobile
- [x] Checkout courses + export Share
- [x] Onglet Tâches + profil 👤
- [x] Favoris + ajouter manquants aux courses
- [x] Avatars membres groupe

### Tests
- [x] Vitest API 20/20

---

## 2026-05-28 (UX produit) — refonte courses + audit AnyList/Bring

### Recherche & benchmark
- Comparaison AnyList / Bring / Listonic → `docs/UX-AUDIT.md`
- Patterns retenus : coche circulaire, sections, barre progression, pull-refresh

### Livré
- [x] Palette Tailwind complète (`ink` 200–800, `emerald`)
- [x] Liste courses refaite (SectionList, ChecklistToggle 44pt, ListProgressBar)
- [x] Tab bar icônes + i18n onglets
- [x] Hub : safe area dock, pull-refresh, hero tagline
- [x] Screen + KeyboardAvoidingView (courses, frigo, magasins)
- [x] Mois i18n (`useMonthLabels`)
- [x] EmptyState enrichi, UnitPicker 44pt
- [x] Tests : 12/12 smoke + 15/15 unit

### Prochaine étape Steve
- Relancer Expo `start:clear` et tester courses sur mobile 360px
- Valider le geste « tap cercle = cocher » (comme AnyList)

---

### Fait
- [x] **Bug critique** : imports routes API corrigés → API redémarre
- [x] **Script** `scripts/test-features-api.mjs` — 12 checks E2E (saison, jardin, magasins, chat, recettes)
- [x] **Tests unitaires** : `store.catalog.test.ts`, `app-modules.test.ts` → 15 tests API verts
- [x] **UX** : stepper recette amélioré (points cliquables, % progression, bouton Recommencer, touch 48px)
- [x] **UX** : aperçu saison sur hub (`SeasonPreviewCard`)
- [x] **UX** : raccourcis groupe (`GroupQuickActions`) + lien catalogue depuis onglet recettes
- [x] **UX** : icônes frigo, chat SafeArea, comparateur auto depuis courses
- [x] **Catalogue magasins** : +12 produits mock (carotte, tomate, beurre, riz)
- [x] **DB** : push GroupMessage + seed 19 recettes

### À tester manuellement (Steve, mobile)
- [ ] F2 stepper sur téléphone
- [ ] F9 chat entre 2 comptes
- [ ] Parcours courses → comparer → ouvrir lien Leclerc

---

### Fait
- [x] **Hub accueil** : section « Outils perso » (saison, jardin, magasins, catalogue recettes) — `(app)/index.tsx`, `app-modules.ts`
- [x] **Recettes step-by-step** : `RecipeStepper` + `parseRecipeSteps()` sur détail groupe et catalogue perso
- [x] **IngredientAvatar** : icônes catégorie sur courses et ingrédients recette
- [x] **API outils** : `GET /api/tools/season`, `GET /api/tools/garden`
- [x] **API magasins (mock)** : `GET /api/stores/suggest`, `POST /api/stores/compare` + liens depuis courses
- [x] **Chat groupe** : modèle `GroupMessage`, routes chat, panneau modal (groupes non perso)
- [x] **Catalogue recettes** : 19 recettes seed (+6), écran browse perso
- [x] **Doc tests** : `docs/FEATURES.md` (F1–F9)

### À tester (Steve)
- [ ] F1–F9 dans `docs/FEATURES.md`
- [ ] Chat après redémarrage API + `db push`

### Briques
- Données mock magasins dans `store.catalog.ts` (v2 : OFF / partenariat drive)

---

### Fait
- [x] **Bug courses** : `groupId` absent sur les onglets (Expo Router web) → hook `useGroupId()` avec `useGlobalSearchParams`.
- [x] **UI frigo** : formulaire d’ajout manuel (API existait déjà).
- [x] **Espace personnel** : groupe « Mon espace » auto-créé au 1er `GET /api/groups`.
- [x] **Features par groupe** : `Group.features[]`, toggles owner, onglets masqués si désactivé.
- [x] **DELETE /api/groups/:id** (owner, pas l’espace perso).
- [x] Header « groups/[groupId] » masqué via `groups/_layout.tsx`.
- [x] Schéma Supabase : `isPersonal`, `features` (db push OK).

### À tester
- [ ] Ajouter article courses + cocher → frigo.
- [ ] Frigo manuel → onglet Recettes avec suggestions.

---

## 2026-05-27 (mercredi) — session diagnostic auth (agent)

### Fait
- [x] **Smoke E2E** : `scripts/test-supabase-auth.mjs` (signup + token + `GET /api/groups`).
- [x] **Smoke stack** : `scripts/smoke-stack.ps1` corrigé (PowerShell + bundle Expo).
- [x] **Bug API 500** après signup : collision `username` `agenttest` en tests → fallback `user_<uuid>` dans `apps/api/src/plugins/auth.ts`.
- [x] Auth mobile : `localStorage` web, `auth-errors.ts`, `DevConfigWarning`, `app.config.js`, login/signup.
- [x] `pnpm test` (9) + `pnpm typecheck` + `pnpm smoke:stack` : **verts**.

### Diagnostic « Failed to fetch » (signup web)
- Côté **serveur/Node** : Supabase signup + API **OK** (clé `sb_publishable_...` valide).
- Causes probables côté **navigateur** : cache Expo sans `.env`, extension pub/CORS, ou ancienne session. **Relancer `start:clear`** et tester navigation privée.
- Après inscription réussie, l’app appelle l’API : l’erreur 500 username (corrigée) pouvait donner l’impression d’un échec global.

### En cours
- [ ] Validation UI par Steve sur **8081**.

### Bloqueurs
- Aucun côté CI local ; tests mobile UI non automatisés (pas de Playwright).

---

## 2026-05-27 (mercredi) — catalogue ingrédients

### Fait
- [x] Modèle **`Ingredient`** + lien `RecipeIngredient.ingredientId` (suppression du nom libre).
- [x] Données : `prisma/data/ingredient.catalog.ts` (49), `recipe.catalog.ts` (13 recettes).
- [x] Seed idempotent + migration Supabase (recettes anciennes purgées, users/groupes conservés).
- [x] `GET /api/ingredients`, matching par aliases, 9 tests Vitest.

### Fichiers clés
- `apps/api/prisma/schema.prisma` — `Ingredient`, `IngredientCategory`
- `apps/api/src/services/ingredient-normalize.service.ts`
- `apps/api/src/routes/ingredients.routes.ts`

---

## 2026-05-27 (mercredi) — session autonome

### Fait
- [x] **Tests API** (7) : `group.service`, `recipe-matching.service`, `fridge.service` (fusion frigo).
- [x] **Vitest** : env de test injecté, `VITEST` empêche le listen HTTP au import de `server.ts`.
- [x] **Mobile UX** :
  - `LoadingCenter`, `EmptyState`, `useMutationError`.
  - Écran `/(app)/join` (accepter invitation par token).
  - Partage invitation via `Share.share` sur l’accueil groupe.
  - Suppression article courses (appui long + `DELETE /api/shopping/:id`).
  - Bouton « Rejoindre un groupe » sur l’accueil + bannière pub placeholder.
  - i18n FR/EN : clés `invite.*`, `shopping.delete*`.
- [x] `pnpm test` + `pnpm typecheck` : OK.

### En cours
- [ ] Test manuel Steve (mobile web / Android).
- [ ] Migration Prisma versionnée dans le repo (optionnel tant que `db push` suffit en dev).

### Bloqueurs
- Aucun technique côté agent — en attente retour utilisateur sur le parcours mobile.

---

## 2026-05-27 (mercredi) — matin

### Fait
- [x] Dépannage **GitHub CLI** : doc README + `scripts/push-to-github.ps1` complète le PATH avec `C:\Program Files\GitHub CLI` si `gh` absent.
- [x] Clarification **Supabase vs MongoDB** : section README + ADR `docs/adr/001-base-de-donnees-postgres-supabase.md`.
- [x] `docker-compose.yml` (Postgres 16 local optionnel) + `.env.example` commenté.
- [x] `pnpm install` + typecheck API + typecheck mobile : OK sur cette machine.
- [ ] Docker Desktop : non installé sur l’environnement agent — Steve peut l’installer ou utiliser uniquement Supabase pour la DB.

### En cours
- [ ] `gh auth login` + push GitHub (Steve).
- [ ] Projet Supabase + `.env` rempli + première migration.

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
- [x] Premier `pnpm install` (1m07s, 1251 packages, OK).
- [x] Premier commit local sur `main` + branches `commit` et `dev` créées.
- [x] Typecheck API : 0 erreur. Typecheck mobile : 0 erreur. Prisma generate : OK.
- [x] Script `scripts/push-to-github.ps1` prêt pour la création du repo GitHub.
- [ ] Push GitHub (attend `gh auth login` côté Steve).
- [ ] Création du projet Supabase + récupération des clés.
- [ ] Première migration Prisma sur la DB Supabase.
- [ ] Lancement local + test E2E (signup → groupe → courses → frigo → matching recette).

### Bloqueurs / Décisions à prendre
- **gh CLI auth** : Steve doit lancer `gh auth login` (interactif) pour qu'on puisse créer le repo et push les 3 branches.
- **Projet Supabase** : à créer côté Steve (https://supabase.com → New Project) — gratuit. Une fois fait, copier l'URL, anon key et service_role key dans `.env`.
- **Compte AdMob** : optionnel pour la v1 (IDs de test fonctionnent en dev).

### Briques tech-bricks
- Utilisé : `@tech-bricks/auth-supabase` v0.1.0
- Stub intégré pour : `@tech-bricks/ads` v0.1.0
- Candidat futur : brique `i18n` à factoriser depuis `apps/mobile/src/lib/i18n` lors du 2ᵉ projet utilisateur.
