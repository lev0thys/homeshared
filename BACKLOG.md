# Backlog — homeshared

## v1.x (post-v1 court terme)

### [v1.1] AdMob réel branché
- **Description courte** : Brancher `react-native-google-mobile-ads` dans la brique `@tech-bricks/ads`, intégrer la bannière sur l'écran groupes.
- **Complexité** : 4/10
- **Valeur estimée** : 🟢 forte (revenus)
- **Notes techniques** : nécessite compte AdMob + config plugin Expo + UMP RGPD.
- **Ajoutée le** : 2026-05-26

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
