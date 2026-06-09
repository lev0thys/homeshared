# Features modulaires — homeshared

Checklist pour tester **une feature à la fois**. Cocher après validation manuelle.

## Prérequis communs

- [ ] API sur `:3001` (`pnpm dev:api`)
- [ ] Mobile sur `:8081` (`pnpm --filter @homeshared/mobile start:clear`)
- [ ] Compte connecté + espace perso visible

---

## F1 — Hub accueil & modules perso

**Fichiers** : `apps/mobile/app/(app)/index.tsx`, `packages/shared/src/app-modules.ts`

- [ ] Section « Outils perso » visible au-dessus des groupes
- [ ] 4 tuiles : Saison, Jardin, Magasins, Catalogue recettes
- [ ] Navigation vers chaque écran OK

---

## F2 — Recettes étape par étape

**Fichiers** : `RecipeStepper.tsx`, `recipes/[recipeId].tsx`, `tools/recipe/[recipeId].tsx`

- [ ] Détail recette (groupe) : mode étapes avec Précédent / Suivant
- [ ] Indicateur de progression (points + « Étape X / Y »)
- [ ] Bascule « Texte brut » ↔ « Mode étapes »
- [ ] Test mobile (viewport ~360px) : boutons touchables

---

## F3 — Icônes ingrédients / articles

**Fichiers** : `IngredientAvatar.tsx`, courses + détail recette

- [ ] Emoji catégorie sur chaque ligne courses
- [ ] Emoji sur ingrédients recette

---

## F4 — Produits de saison

**API** : `GET /api/tools/season?month=1-12`  
**UI** : `apps/mobile/app/(app)/tools/season.tsx`

- [ ] Mois courant pré-sélectionné
- [ ] Changement de mois met à jour fruits/légumes
- [ ] Liste non vide pour juin–septembre

---

## F5 — Jardinage (hors groupe)

**API** : `GET /api/tools/garden?month=1-12`  
**UI** : `apps/mobile/app/(app)/tools/garden.tsx`

- [ ] Tâches semis/plantation/bouture par mois
- [ ] Badge beta visible

---

## F6 — Magasins : recherche produit

**API** : `GET /api/stores/suggest?q=...`  
**UI** : `tools/stores.tsx` + lien depuis courses

- [ ] Recherche « lait » → 3 offres mock (Leclerc/Auchan/Carrefour)
- [ ] Clic ouvre URL recherche magasin
- [ ] Sur courses : « Voir en magasin » déplie offres

---

## F7 — Comparateur de prix (mock)

**API** : `POST /api/stores/compare` body `{ items: string[] }`

- [ ] Bouton « Comparer les prix » depuis liste courses (articles non cochés)
- [ ] Liste pré-remplie dans écran Magasins
- [ ] Totaux par enseigne + enseigne la moins chère affichés

---

## F8 — Catalogue recettes (browse)

**API** : `GET /api/recipes`  
**UI** : `tools/recipes.tsx`

- [ ] Liste ≥ 230 recettes (après re-seed)
- [ ] Détail avec stepper depuis catalogue perso

---

## F9 — Chat de groupe

**Schéma** : `GroupMessage`  
**API** : `GET/POST /api/chat/:groupId`, `DELETE /api/chat/:messageId`  
**UI** : `GroupChatPanel.tsx`, bouton 💬 dans header groupe (pas espace perso)

- [ ] `pnpm --filter @homeshared/api prisma db push` appliqué
- [ ] Envoi message visible pour tous les membres
- [ ] Polling / refresh messages OK

---

## F10 — Finaliser les courses (caddie → frigo → vider liste)

**API** : `POST /api/shopping/:groupId/purchase-all`, `POST /api/shopping/:groupId/finalize`  
**UI** : `shopping.tsx`

- [ ] Cocher articles → vont au frigo (existant)
- [ ] « Tout au caddie » coche tous les articles restants
- [ ] « Valider les courses (payé) » vide la section caddie (articles déjà au frigo)
- [ ] Si articles non cochés : alerte « ignorer et vider »

---

## F11 — Export liste vers drive

**Doc** : `docs/adr/003-export-drive-courses.md`  
**UI** : bouton « Exporter la liste » (Share API)

- [ ] Partage texte `quantité unité nom` par ligne
- [ ] Coller manuellement dans recherche Leclerc/Auchan/Carrefour

---

## F12 — Recettes : favoris + manquants → courses

**API** : `POST/DELETE /api/recipes/:id/favorite`, `POST /api/recipes/:id/shopping-missing`  
**UI** : détail recette groupe

- [ ] Étoile favori persiste
- [ ] Favoris remontent en tête du matching frigo
- [ ] « Ajouter manquants aux courses » crée les lignes shopping

---

## F13 — Tâches maison (groupe)

**Schéma** : `HouseholdTask`  
**API** : `/api/tasks/*`  
**UI** : onglet Tâches (activer module TASKS dans réglages groupe)

- [ ] Créer tâche unique / quotidienne / hebdo / mensuelle
- [ ] « Je m'en occupe » assigne un membre
- [ ] « Terminer » marque fait (récurrentes se réouvrent)

---

## F14 — Profil utilisateur

**API** : `GET/PATCH /api/users/me` (bio, stats)  
**UI** : `app/(app)/profile.tsx` (icône 👤 hub)

- [ ] Affichage pseudo, email, nb groupes, nb favoris
- [ ] Édition nom + bio

---

## F15 — Saison & jardin enrichis (France)

**Data** : `season.produce.ts` (~45 produits), `garden.calendar.ts` (~45 tâches, 12 mois)

- [ ] Chaque mois a des entrées jardin (semis/plantation/récolte)
- [ ] Saison : plus de fruits/légumes couvrant l'année

---

## F16 — Partage groupe (vérification)

**API** : invites + memberships  
**UI** : accueil groupe, chat, membres avec avatar

- [ ] Inviter → partager code → rejoindre (`/join`)
- [ ] 2 comptes voient la même liste courses / frigo / chat

---

## Commandes utiles

```powershell
cd homeshared
pnpm --filter @homeshared/api exec prisma db push   # nouveaux modèles (Task, Favorite, bio)
pnpm --filter @homeshared/api exec prisma db seed   # 28 recettes
node scripts/test-features-api.mjs
pnpm --filter @homeshared/api test
```
