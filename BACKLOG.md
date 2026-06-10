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

### [v1.2] Edition / suppression d'items frigo via UI
- **Description courte** : Écran de détail frigo avec édition quantité, date d'expiration, consommation.
- **Complexité** : 3/10
- **Valeur estimée** : 🟡 moyenne
- **Notes techniques** : API déjà prête, juste UI.
- **Ajoutée le** : 2026-05-26

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

### [v2] Courses — cocher « dans le caddie » en optimistic UI (zéro latence perçue)
- **Description courte** : Au tap sur un article, l’UI bascule **immédiatement** (coché / section « fait ») ; la synchro serveur (`POST /purchase` + frigo) se fait en arrière-plan. Rollback + toast si échec.
- **Complexité** : 4/10
- **Valeur estimée** : 🟢 forte (parcours le plus fréquent en magasin)
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
