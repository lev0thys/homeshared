# Validation des recettes — homeshared

## Principe

Les recettes du catalogue sont **rédigées par homeshared** (pas copiées depuis des sites).  
Avant publication, chaque famille de plats est **confrontée** à des sources culinaires reconnues pour :

- proportions plausibles (g / pers.),
- temps de cuisson réalistes,
- consignes de **sécurité alimentaire** (ANSES, guides officiels).

Ce n’est pas une reprise de texte : c’est un contrôle qualité / sécurité.

## Références utilisées (échantillon vérifié)

| Plat | Source consultée | Critère retenu |
|------|------------------|----------------|
| Rouleaux de printemps | [Jow](https://jow.com/fr/recipes/rouleaux-de-printemps-a-la-crevette-8lc8i62v8rcicviq0s4f), [recettes.com](https://www.recettes.com/recettes/recette-rouleau-de-printemps/) | 120 g vermicelles + 250–500 g crevettes / 12 rouleaux ; tremper feuille 5–10 s |
| Salade tomate-mozzarella | Usage courant | 125 g mozza / 2 pers. ; pas de cuisson |
| Poulet (toutes recettes) | ANSES / USDA via guides FR | **74 °C à cœur** (cuisse, sans toucher l’os) |
| Bœuf haché | Canada.ca / ANSES | **71 °C minimum** |
| Poisson cuit | ANSES | **≈63 °C**, chair opaque |
| Ceviche | Bonnes pratiques pro | Poisson sashimi-grade, mariner ≥30 min, **pas de cuisson au feu** |
| Moules marinières | Règle sanitaire FR | Jeter coquilles **restées fermées** après cuisson |
| Œufs crus (tiramisu, mousse) | ANSES | Œufs **pasteurisés** recommandés |
| Sorbet citron | Ratio classique | ~150 ml jus + 400 ml eau + 80 g sucre / 6 pers. |

## Corrections appliquées (2026-05-28, session audit)

- **31 recettes** : instructions placeholder remplacées par étapes réelles (`pnpm recipes:patch`).
- **Sécurité** : nems poulet (pré-cuisson farce), brochettes 74 °C, pho bœuf bouillon frémissant, crevettes roses.
- **Unités** : œufs en pièces (`unit: null`), biscuits tiramisu (24 pièces).
- **Core** : salade César poulet, bolognaise, poulet moutarde — températures explicites.
- **Validateur** : `pnpm recipes:validate` bloque placeholders, œufs en « g », incohérences titre/ingrédients.

## Corrections appliquées (2026-05-28)

- **Ceviche** : instructions corrigées (plus de « poêle/four »).
- **Sorbet citron** : suppression du bouillon (erreur de mapping) → eau + citron + sucre.
- **Canard laqué** : renommé **Porc laqué miel-soja** (ingrédients cohérents).
- **Rouleaux de printemps** : proportions alignées sur sources ci-dessus.
- **Poulet / brochettes** : temps minimum + mention 74 °C dans les étapes.
- **Moules** : étape « coquilles fermées à jeter ».
- **Desserts à œufs crus** : rappel œufs pasteurisés.

## Commandes de vérification

```powershell
cd homeshared
pnpm recipes:validate               # contrôle automatique (231 recettes)
pnpm recipes:patch                  # applique patches instructions/unités
pnpm recipes:audit                  # rapport docs/audit-recettes-catalogue.md
pnpm recipes:generate               # régénère le bulk après modif script
```

## Limites

- Catalogue **indicatif** pour la maison : allergies, grossesse, enfants → responsabilité utilisateur.
- Pas de garantie nutritionnelle (calories, sel) en v1.
- Recettes « express » simplifient parfois un plat traditionnel.
