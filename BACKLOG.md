# Backlog — homeshared

## v1.x (post-v1 court terme)

### [v1.x] Anti-spam renforcé (WAF / Supabase) — complément rate limit API
- **Description courte** : Couche infra au-delà du rate limit Fastify déjà en place (100 req/min/IP + limites par route).
- **Complexité** : 3/10
- **Valeur estimée** : 🟡 moyenne (surtout si trafic public augmente)
- **Notes techniques** : activer rate limits Supabase Auth (signup/login) ; option Fly.io `fly proxy` / WAF ou Cloudflare devant l’API ; captcha sur signup si abus ; monitoring 429 dans logs Fly.
- **Ajoutée le** : 2026-06-09

### [v1.1] Instructions desserts catalogue — FAIT (2026-05-28)
- 20 desserts : remplacement textes génériques par étapes réelles + validateur bloquant.
- Commandes : `pnpm recipes:validate`, `pnpm recipes:patch`, `pnpm prisma:seed`.

### [v1.1] Pool Supabase + auth cache — FAIT côté code (2026-05-28)
- Cache auth 5 min, reconnexion Prisma, logs allégés, cache mobile 24h
- **Steve** : suivre `docs/SETUP-STEVE.md` étape 1 (URLs pooler 6543 + direct 5432)

### [v1.x] Recettes enrichies — plan semaine, catégories, favoris ★ (2026-05-31)
- **Description** : étoile favori cliquable, filtres cuisine (indien, italien…), % + ingrédients manquants, repas de la semaine (lundi midi…), onglets Habitudes / Favoris / Propositions / Saison / Découverte, baisse de fréquence si propositions ignorées.
- **Complexité** : 7/10
- **Valeur estimée** : 🟢 forte
- **Notes** : `pnpm prisma:db-push` + `pnpm prisma:seed` requis (champ `Recipe.cuisine`, `MealPlanEntry`, `RecipeProposalDismiss`).
- **Reste v2** : notes/avis recettes, saison branchée sur module jardin, notifications push rappels repas.
- **Ajoutée le** : 2026-05-31

### [v1.1] AdMob bannière accueil — FAIT (2026-05-28)
- Bannière `@tech-bricks/ads` sur écran **Mes espaces** ; IDs AdMob réels Steve (`home_banner`).
- **Steve** : build APK EAS pour voir les vraies pubs (pas web / Expo Go). Voir `docs/PUBLICATION-ANDROID-ADS.md`.
- **UMP consentement RGPD** : FAIT v1 (2026-05-28) — `requestAdsConsent` + préférences profil Android.

### [v1.x] Pubs opt-in recettes (rewarded) — avec refonte recettes
- **Description courte** : Vidéos récompensées **facultatives** aux moments « satisfaction » : fin des étapes recette (`RecipeStepper`), repas marqué cuisiné (planning), plus tard création recette. Jamais obligatoire ; masqué comptes enfant ; cooldown session.
- **Complexité** : 5/10
- **Valeur estimée** : 🟢 forte (revenus > bannière seule, UX non invasive)
- **Notes techniques** : brancher `showRewardedAd` dans `@tech-bricks/ads`, unité AdMob Rewarded, dépend du chantier recettes (stepper, mark done). Bannière accueil conservée en v1.
- **Ajoutée le** : 2026-05-28

### [v1.1] Magic link auth
- **Description courte** : Ajouter le login par lien email (Supabase le supporte nativement).
- **Complexité** : 2/10
- **Valeur estimée** : 🟡 moyenne
- **Notes techniques** : UI seule à ajouter, ~50 lignes. Update brique `auth-supabase`.
- **Ajoutée le** : 2026-05-26

### [v1.1] Dark mode
- **Description courte** : Toggle thème clair/sombre + détection OS.
- **Complexité** : 2/10
- **Valeur estimée** : 🟡 moyenne
- **Notes techniques** : NativeWind supporte dark via `dark:` modifier.
- **Ajoutée le** : 2026-05-26

### [v1.x] Edition / suppression d'items frigo via UI
- **Description courte** : Écran de détail frigo avec édition quantité, date d'expiration, consommation.
- **Complexité** : 3/10
- **Valeur estimée** : 🟡 moyenne
- **Notes techniques** : API déjà prête, juste UI.
- **Ajoutée le** : 2026-05-26

### [post-v2] Publication App Store iOS (compte Apple Developer 1 an)
- **Description courte** : Soumettre homeshared sur l’App Store — **pas avant une version bien polie** (Steve décide du timing ; compte dev déjà payé pour anticiper).
- **Complexité** : 4/10 (première fois) · 2/10 (mises à jour suivantes)
- **Valeur estimée** : 🟢 forte (iOS natif + pubs AdMob iOS, plus de PWA seule)
- **Notes techniques** :
  - Compte **Apple Developer** actif (Steve, mai 2026).
  - `eas.json` : ajouter profil `ios` production ; credentials EAS + App Store Connect.
  - Dossier `app-store/` (captures 6.7", description FR/EN, politique confidentialité URL).
  - **Review Apple** : justifier `expo-location` (foreground, mode magasin) dans les notes de review — pas de background GPS en v2.
  - AdMob : unités iOS + `GADApplicationIdentifier` dans `Info.plist` (plugin ads).
  - PWA reste un canal gratuit ; App Store = canal principal iOS.
- **Ajoutée le** : 2026-05-28

### [v2] Modules métier par groupe (barbecue, cartes fidélité…)
- **Description courte** : Étendre `features` au-delà de SHOPPING/FRIDGE/RECIPES (ex. BARBECUE avec planning invités, sans frigo).
- **Complexité** : 6/10
- **Valeur estimée** : 🟢 forte
- **Notes techniques** : base posée (`Group.features[]`, onglets conditionnels). Ajouter écran + API par module.
- **Ajoutée le** : 2026-05-28

### [v2] Catalogue produits magasins FR (priorité gratuite, sans partenaire)
- **Description courte** : Recherche produits avec images, variantes (ex. pommes de terre grenaille), export vers drive courses en ligne si faisable « maison ».
- **Complexité** : 9/10
- **Valeur estimée** : 🟢 forte
- **Notes techniques** (choix PO Steve, 2026-05-29) :
  - **Gratuit d’abord**, temps de dev OK.
  - **Images** : pas d’API magasin fiable/gratuite → Open Food Facts (API libre) + icônes/illustrations catalogue maison en secours.
  - **Liste produits** : enrichir notre catalogue `Ingredient` (aliases, variantes) ; OFF pour EAN/nom proche ; pas de scrape drive en v1 (ToS).
  - **Export courses en ligne** : v2.1 = copier/coller liste structurée ; v2.2 = deep links manuels par enseigne (URLs panier, sans API) ; intégration API magasin seulement si compte dev gratuit un jour.
  - Enseignes cibles à préciser : Carrefour / Leclerc / Auchan (ordre TBD).
- **Ajoutée le** : 2026-05-29

## v2 (post-v1)

> **★ Feature principale v2 (Steve)** : **GPS magasin** — voir `docs/V2-VISION.md` + `docs/V2-RESEARCH-TECH.md`.  
> Tout le backlog v2 ci-dessous gravite autour de ce chantier ; menus / simplification = support UX.

### [v2] ★ GPS magasin — release unique (tout dans la v2)

**Décision Steve** : pas de sous-releases v2.0 / v2.1 / v2.2 — **une seule v2** avec l’ensemble du GPS magasin.

**Objectif release** : guider l’utilisateur en magasin (liste + route + capteurs + foule), téléphone **en main**, logique **côté app** (BDD minimale : `ShoppingItem` + contributions Waze uniquement).

| Bloc | Livrable | Où |
|------|----------|-----|
| CTA | Bouton **« Je suis au magasin »** quand la liste est prête | `shopping.tsx` |
| Plan 2D | Schéma allées + chemin optimal + point user à l'entrée | `StoreMap2D`, `layouts/`, `react-native-svg` |
| Rayonnage base | Templates hyper/super/proxi + OSM indoor si dispo | `merge-osm-indoor.ts` |
| Capteurs | PDR : pas, virages ; point sur le plan ; recalage au cocher | `expo-sensors`, `usePdrSession` |
| Communauté | Batch à validation : emplacements trouvés, rupture, mauvais pin ; confiance interne | `StoreContributionBatch` + `ContributorTrust` |
| Recalage | « Je suis ici » sur le plan 2D | `usePdrSession` + brouillon `POSITION_FIX` |
| Pionnier | Bandeau 1er user sur le magasin + `LAYOUT_FEEDBACK` | `PioneerStoreBanner.tsx` |
| Pub opt-in fin courses | Vidéo **rewarded** facultative après « Courses terminées » — **aligner revenus sur usage GPS** (éviter perte si croissance) | `showRewardedAd('shopping_complete')` ; cache agrégats contributions ; rate limit batch |
| **Perf v2** | Optimisation échanges serveur + fluidité client | Cache local (`local-cache/`), snapshot mode magasin, invalidations ciblées TanStack, `useStoreModeQueryPolicy`, rate limits batch contributions |

→ Spec complète : `docs/V2-GPS-IMPLEMENTATION.md`

- **Complexité globale** : 9/10
- **Valeur estimée** : 🟢 forte (différenciateur produit)
- **Ajoutée le** : 2026-06-10 · **Scope unifié** : 2026-05-28

### [URGENT] RLS Supabase — tables publiques exposées
- **Description courte** : Dashboard Supabase CRITICAL : RLS désactivé + colonnes sensibles (`User.email`, `Invite.token`) accessibles via clé anon.
- **Action** : exécuter `supabase/rls/001_enable_rls.sql` dans SQL Editor — voir `docs/SECURITY-RLS-SUPABASE.md`
- **Complexité** : 1/10 (5 min)
- **Valeur estimée** : 🟢 critique (sécurité prod)
- **Ajoutée le** : 2026-05-28

### [v2] Rapports métriques hebdomadaires — FAIT (script + CI)
- **Description courte** : Rapport auto chaque lundi : users, actifs, taille BDD, coûts/revenus estimés, alertes.
- **Usage** : `pnpm metrics:weekly` · workflow `weekly-metrics.yml` · fichiers `reports/metrics/YYYY-MM-DD.md`
- **Setup CI** : secret GitHub `DIRECT_DATABASE_URL` — voir `docs/METRICS-WEEKLY.md`
- **Ajoutée le** : 2026-05-28

### [v2.x / v?] Monétisation — pubs obligatoires vs abonnement ~1 € (à arbitrer)
- **Description courte** : Éviter de perdre de l’argent à la croissance **sans** dégrader l’UX GPS. Options : (A) pubs opt-in seules v2 · (B) interstitiel **obligatoire** à moments limités · (C) **homeshared+** ~0,99–1,99 €/mois sans pub.
- **Recommandation agent (Steve)** : **v2 = (A) uniquement** (bannière + rewarded fin courses + perf §5.4). Introduire (C) si coûts Fly+Supabase > revenus pubs **3 mois de suite**. (B) seulement si refus abonnement ET besoin cash — jamais pendant navigation 2D.
- **Moments acceptables si (B)** : après « Courses terminées » (sortie mode magasin), max 1/session, pas en plein rayon.
- **Abonnement** : Google Play Billing / `expo-iap` ; brique `@tech-bricks/iap` à créer ; commission store ~15 % ; 1 €/mois × 2 % conversion sur 10 k MAU ≈ 170 € net/mois (plus prévisible que pubs).
- **Complexité** : 6/10 (IAP + paywall + restore achats)
- **Valeur estimée** : 🟢 forte (viabilité long terme)
- **Ajoutée le** : 2026-05-28

### [v2] Refonte menus — simplification (support GPS)
- **Description courte** : Menus / hub allégés ; CTA clair « Mode magasin » / « Mes courses » ; modules secondaires (frigo, recettes…) discrets mais accessibles.
- **Complexité** : 5/10
- **Valeur estimée** : 🟢 forte
- **Notes techniques** : refonte navigation ; pas bloquant pour un POC GPS mais requis pour une v2 perçue comme produit courses-first.
- **Ajoutée le** : 2026-06-10

### [v2] Onboarding intentions — « Pourquoi avez-vous installé l’app ? » (à arbitrer)
- **Description courte** : Au 1er lancement (post-auth) : choix des usages (courses, frigo, recettes, tâches, partage) ; question dédiée « Lier le frigo ? » oui/non → masque ou active modules ; réactivation dans Profil.
- **Complexité** : 4/10
- **Valeur estimée** : 🟢 forte
- **Notes techniques** : `UserPreferences` / `enabledModules[]` ; sync avec `Group.features[]` ; écran « Reconfigurer mon usage ». Voir `docs/V2-VISION.md` §1.
- **Ajoutée le** : 2026-06-10

### [v2] Localisation produits — partenariats enseignes (hors scope lancement)
- **Description courte** : Plans officiels + référentiel produit ↔ emplacement (Carrefour, Leclerc, Auchan…).
- **Complexité** : 9/10
- **Valeur estimée** : 🟢 forte (fiabilité + B2B)
- **Notes techniques** : voie B de `docs/V2-VISION.md` ; APIs souvent fermées — arbitrage business avant dev ; même schéma données que mode Waze pour fusion future.
- **Ajoutée le** : 2026-06-10

### [v2] Centre de notifications (tâches, messages, activité)
- **Description courte** : Push + fil in-app : nouvelle tâche, message groupe, changements liste courses partagée, rappels (repas, frigo).
- **Complexité** : 6/10
- **Valeur estimée** : 🟢 forte (engagement)
- **Notes techniques** : Expo Notifications ; préférences par type ; badge ; complète entrées push existantes backlog. `docs/V2-VISION.md` §3.
- **Ajoutée le** : 2026-06-10

### [v2] Courses — cocher « dans le caddie » en optimistic UI (inclus GPS magasin v2)
- **Description courte** : Au tap sur un article, l’UI bascule **immédiatement** (coché / section « fait ») ; synchro serveur en arrière-plan. Indispensable en mode magasin.
- **Complexité** : 4/10
- **Valeur estimée** : 🟢 forte
- **Notes techniques** : aujourd’hui `shopping.tsx` attend la mutation puis `invalidateQueries` (shopping + fridge + recipes-match) → latence réseau visible. Pattern TanStack Query `onMutate` + `setQueryData` optimiste ; même logique pour `unpurchase`, `purchase-all` ; conflit realtime (autre membre) = merge ou refresh léger. API inchangée (transaction achat → frigo déjà côté serveur).
- **Remontée par** : Steve — validé v1 sauf APK ; reporté volontairement en v2.
- **Ajoutée le** : 2026-06-10

### [v2] Calendrier saison aligné Manger Bouger + régions
- **Description courte** : Enrichir `season.produce.ts` (cresson, oseille, blettes…), script d’audit mensuel automatisé, profils Nord/Sud/Méditerranée.
- **Complexité** : 5/10
- **Valeur estimée** : 🟢 forte (confiance utilisateur)
- **Notes techniques** : `scripts/audit-season-calendar.mjs`, voir `docs/audit-calendriers-saison-jardin.md`.
- **Ajoutée le** : 2026-05-28

### [v2] Compte enfant géré par parent (sans email)
- **Description courte** : Le parent crée le profil enfant sans inscription email séparée (login familial ou PIN).
- **Complexité** : 6/10
- **Valeur estimée** : 🟢 forte (foyers famille)
- **Notes techniques** : Supabase custom claims ou comptes liés ; RGPD consentement parental.
- **Ajoutée le** : 2026-05-28

### [v2] Notifications push rappels repas / tâches
- **Description courte** : Envoyer une notification à `reminderAt` (préparation repas, cuisson, tâches assignées).
- **Complexité** : 5/10
- **Valeur estimée** : 🟢 forte
- **Notes techniques** : Expo Notifications + cron/worker ; `HouseholdTask.reminderAt` déjà en place.
- **Ajoutée le** : 2026-05-28

### [v2] Fuzzy match frigo ↔ catalogue (nom libre → ingrédient le plus proche)
- **Description courte** : « pomme de terre » saisi → proposer rattachement à l’ingrédient canonique + score de confiance.
- **Complexité** : 5/10
- **Valeur estimée** : 🟢 forte
- **Notes techniques** : aliases déjà en seed ; étendre normalisation + UI « Ce n’est pas la bonne correspondance ».
- **Ajoutée le** : 2026-05-29

### [v2] Recettes externes (Marmiton / Spoonacular)
- **Description courte** : Import ou lien vers recettes tierces depuis l’écran détail.
- **Complexité** : 6/10
- **Valeur estimée** : 🟡 moyenne
- **Notes techniques** : pas d’API Marmiton officielle ; Spoonacular payant ; alternative : catalogue interne enrichi.
- **Ajoutée le** : 2026-05-29

### [v2] Espace utilisateur sans concept de « groupe »
- **Description courte** : UI solo qui masque le mot « groupe » ; données toujours sous un espace personnel technique.
- **Complexité** : 4/10
- **Valeur estimée** : 🟡 moyenne
- **Notes techniques** : `isPersonal` + auto-création déjà en place ; reste le parcours UX (redirect direct, pas de liste).
- **Ajoutée le** : 2026-05-28

## v2 (post-v1, moyen terme)

### [v2] Cartes de fidélité partagées
- **Description courte** : Stockage de cartes de fidélité (code-barres / QR) accessibles à tous les membres d'un groupe.
- **Complexité** : 5/10
- **Valeur estimée** : 🟡 moyenne
- **Notes techniques** : nécessite scanner code-barres (`expo-barcode-scanner`), affichage code en plein écran. Candidate à brique `@tech-bricks/loyalty-cards`.
- **Ajoutée le** : 2026-05-26

### [v2] OCR de tickets de caisse → ajout auto au frigo
- **Description courte** : Photo d'un ticket → extraction des articles → ajout au frigo du groupe.
- **Complexité** : 8/10
- **Valeur estimée** : 🟢 forte (différenciateur)
- **Notes techniques** : Google ML Kit on-device OU API cloud (Veryfi, Google Vision). Arbitrer.
- **Ajoutée le** : 2026-05-26

### [v2] Mode hors-ligne complet + sync
- **Description courte** : Permettre l'usage sans connexion, sync différée à la reconnexion.
- **Complexité** : 7/10
- **Valeur estimée** : 🟢 forte (mobile)
- **Notes techniques** : refacto du data layer, file de mutations, gestion conflits. Candidate à brique `@tech-bricks/offline-sync`.
- **Ajoutée le** : 2026-05-26

### [v2] Notifications push
- **Description courte** : Notifier les membres quand un item est ajouté/coché, ou rappels d'expiration frigo.
- **Complexité** : 5/10
- **Valeur estimée** : 🟢 forte (engagement)
- **Notes techniques** : Expo Notifications + Supabase Edge Functions ou backend job.
- **Ajoutée le** : 2026-05-26

### [v2] Recettes communautaires
- **Description courte** : Permettre aux users d'ajouter des recettes publiques avec modération.
- **Complexité** : 6/10
- **Valeur estimée** : 🟡 moyenne
- **Notes techniques** : modération nécessaire (signalement, admin). Endpoints API déjà partiellement prêts.
- **Ajoutée le** : 2026-05-26

### [v2] Normalisation des unités dans le matching de recettes
- **Description courte** : Comprendre "1 L de lait" = "1000 ml de lait" pour le matching frigo ↔ recettes.
- **Complexité** : 5/10
- **Valeur estimée** : 🟡 moyenne
- **Notes techniques** : table de conversion + parser tolérant. Brique candidate `@tech-bricks/units`.
- **Ajoutée le** : 2026-05-26

## v? (idées à creuser)

### [v?] Multi-foyers (un user dans plusieurs foyers, switch rapide)
- Déjà supporté techniquement (n:n via Membership), à fluidifier côté UX.
- **Complexité** : 2/10
- **Valeur estimée** : 🟡 moyenne

### [v?] Budget / suivi des dépenses
- Tracker combien on dépense en courses par mois, par membre.
- **Complexité** : 6/10
- **Valeur estimée** : 🟡 moyenne

### [v?] Liste de tâches partagée
- Module séparé de la liste de courses (ménage, bricolage, etc.).
- **Complexité** : 4/10
- **Valeur estimée** : 🟢 forte (mentionné par Steve mais reporté pour focus v1)
- **Ajoutée le** : 2026-05-26
