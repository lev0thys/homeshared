# ADR-004 — Droits groupe : repas & tâches

- **Statut** : Accepté (phase 1)
- **Date** : 2026-05-31
- **Décideurs** : Steve, agent

## Contexte

Le planning repas et les tâches maison sont aujourd’hui **individuels** (par userId). Dans un foyer partagé, le **titulaire du groupe** doit pouvoir :

- définir qui **voit** le calendrier repas vs qui **choisit** quoi (ex. membre A = lecture seule, membre B = mardi midi uniquement) ;
- **assigner** des repas / corvées et synchroniser préparation + cuisson vers la **liste de tâches** ;
- automatiser « membre X cuisine toujours lundi–mardi » avec **rappel** à l’heure du repas.

## Décision

1. **Calendrier repas = niveau groupe** (une entrée par créneau/semaine, plus par user).
2. **Grants explicites** `MemberMealGrant` : `VIEW` | `EDIT_SLOT` | `EDIT_ALL` (+ jour/créneau optionnels).
3. **OWNER / ADMIN** : droits complets + configuration des grants (API réservée OWNER).
4. **`GroupMealSettings`** : heures matin/midi/soir, sync tâches ON/OFF, propositions tâches ON/OFF.
5. **`MemberMealRule`** : assignation automatique d’un membre à un créneau récurrent → génère tâches + rappel.
6. **Notifications push** : hors phase 1 (rappels stockés en `reminderAt` sur tâche, affichage in-app).

## Alternatives rejetées

- **Rôles seuls (OWNER/ADMIN/MEMBER)** : trop grossier pour « mardi midi seulement ».
- **ACL par recette** : inutilement complexe pour v1.

## Conséquences

- ✅ Modèle clair pour foyers multi-membres.
- ⚠️ Migration : `MealPlanEntry` passe de `userId` unique à `groupId` unique par créneau.
- 🔄 Phase 2 : push notifications, UI matrice complète des droits.
