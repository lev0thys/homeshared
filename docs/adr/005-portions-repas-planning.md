# ADR-005 — Portions et frigo dans le planning repas

- **Statut** : Accepté
- **Date** : 2026-05-28

## Contexte

Le planning hebdomadaire doit afficher des quantités réalistes pour un foyer mixte (adultes / enfants) et rester cohérent avec le frigo qui évolue (courses, repas cuisinés).

## Décision

1. **Portions « équivalent adulte »** : `adultes × 1 + enfants × 0,65` (arrondi à 0,1, minimum 1). Le facteur enfant est une médiane inspirée des repères ANSES (portion enfant 6–12 ans ≈ 65–75 % d’un adulte pour un repas familial type).
2. **Défaut** : nombre de membres du groupe = adultes, surchargeable (`servingsFromMemberCount`).
3. **Créneaux visibles** : matin / midi / soir activables par groupe (`showBreakfast`, `showLunch`, `showDinner`).
4. **Frigo** : suggestions triées par score frigo ; affichage % sur chaque repas ; bouton « Repas fini » qui déduit les ingrédients du frigo.
5. **Vues** : liste (jour par jour) + grille type emploi du temps (jours en colonnes).

## Conséquences

- ✅ UX claire sur mobile et web
- ⚠️ Pas encore de simulation jour-par-jour du frigo sur toute la semaine (v2)
- 🔄 Profils « femme / homme » distincts → backlog si besoin métier
