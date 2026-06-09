# Audit UX — homeshared (revue client 1 h)

Document de synthèse : bonnes pratiques du marché, écarts constatés, actions réalisées et backlog priorisé.

## Références marché

Les apps foyer performantes (Mealime, Flavorish, études Supper / HomeCooked) convergent sur :

| Attente utilisateur | Implication produit |
|---------------------|---------------------|
| **Liste courses partagée temps réel** | Qui a ajouté quoi, coche → frigo, pas de doublons |
| **Lien repas → courses** | Planifier un repas doit pouvoir alimenter la liste (partiellement couvert : manquants recette → courses) |
| **Pantry / frigo** | Savoir ce qu’on a *et* ce qui est déjà « réservé » pour un repas |
| **Planification hebdo** | Vue semaine, navigation semaines, repère « aujourd’hui » |
| **Attribution & collaboration** | Voir qui cuisine, qui a ajouté (partiel : `addedBy` courses) |
| **Friction minimale en magasin** | Gros touch targets, progression liste, export texte |

homeshared est **bien positionné** sur le triangle frigo ↔ planning ↔ courses. Le gap principal vs les leaders : **sync temps réel** et **génération auto liste depuis toute la semaine**.

## Parcours audités

### Accueil (hub)

| Avant | Après (session) |
|-------|-----------------|
| Icônes groupes sans nom | **Nom sous chaque espace** + titre « Mes espaces » |
| Pas de résumé groupe | **Bandeau statut** sur fiche groupe (courses / frigo / repas) |

### Fiche groupe

| Avant | Après |
|-------|-------|
| Accès modules en tuiles seulement | **Puces cliquables** avec compteurs (ex. « 3 à acheter ») |
| — | Lien direct planning / courses / frigo |

### Planning repas

| Avant | Après |
|-------|-------|
| Semaine courante figée | **Navigation ‹ ›** + retour « Cette semaine » |
| % frigo neutre | **Code couleur** vert / ambre / rouge |
| Pas de repère jour | **Colonne « Auj. »** sur la semaine en cours |

### Frigo

| Avant | Après |
|-------|-------|
| DLC peu visibles | **Tri urgence** + libellés « à consommer » / « périmé » |
| Réservations passives | **Bandeau → planning** |
| Pas de pull-to-refresh | **RefreshControl** |

## Backlog UX priorisé (post–1 h)

### P0 — impact immédiat

1. **Sync temps réel** (Supabase Realtime) sur courses + frigo + planning — évite les « tu l’as ajouté ? ».
2. **Bouton « Ajouter les manquants de la semaine aux courses »** depuis le planning (agrégat des créneaux non cuisinés).
3. **Feedback haptique** sur coche course / repas fini (`expo-haptics`).

### P1 — confort

4. Skeleton loaders (hub, liste recettes) au lieu du spinner plein écran.
5. **Swipe** pour cocher une course (pattern standard liste collaborative).
6. Toast discret au lieu d’`Alert` pour « Repas fini » (moins intrusif).
7. Onboarding 3 écrans : espace → courses → frigo/planning.

### P2 — différenciation

8. Attribution « ajouté par » visible sur chaque ligne courses.
9. Mode magasin : plein écran, texte agrandi, masquer pub.
10. Widget PWA « prochain repas » (iOS écran d’accueil).

## Perf / technique (lien `docs/optimisations.md`)

- Scores frigo planning en batch ✅
- Cache catalogue ingrédients ✅
- À faire : pagination match recettes, endpoint résumé groupe (éviter 3 GET sur fiche groupe si volumétrie).

## Tests manuels recommandés (post-changements)

1. Accueil : noms visibles sous les icônes, favoris ★.
2. Groupe : puces statut → navigation correcte.
3. Planning : semaine S+1, retour semaine courante, colonne Auj.
4. Frigo : produit DLC proche en haut, bandeau réservation → planning.
