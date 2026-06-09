# ADR-002 — Catalogue d'ingrédients normalisé

- **Statut** : Accepté
- **Date** : 2026-05-27
- **Décideurs** : Steve, agent

## Contexte

Les recettes référençaient des noms d'ingrédients en texte libre (`RecipeIngredient.name`). Le matching frigo exigeait une correspondance exacte (« œuf » ≠ « œufs »), ce qui dégradait les suggestions.

## Décision

Introduire une table **`Ingredient`** (slug unique, `nameFr`, aliases[], catégorie, unité par défaut) et lier chaque ligne de recette via **`ingredientId`**. Le matching utilise les aliases + normalisation (accents, casse).

Catalogue versionné dans `apps/api/prisma/data/*.catalog.ts`, seed idempotent.

## Alternatives rejetées

- **Garder le texte libre** : matching fragile, pas de réutilisation cross-recettes.
- **Taxonomie externe (Open Food Facts)** : trop lourd pour la v1 ; envisageable en v2 pour scan code-barres.

## Conséquences

- ✅ Matching frigo plus tolérant (« œufs » → ingrédient `oeuf`).
- ✅ API `GET /api/ingredients` pour autocomplete future.
- ✅ ~50 ingrédients et 13 recettes seedées.
- ⚠️ **Breaking** : suppression de `RecipeIngredient.name` — re-seed obligatoire après `db push`.
- 🔄 À revoir si : conversion d'unités (L ↔ ml) ou import recettes externes.
