# ADR-006 — Navigation magasin hybride (rayons + PDR + crowdsourcing)

- **Statut** : Accepté
- **Date** : 2026-05-28
- **Décideurs** : Steve, agent

## Contexte

La v2 de homeshared est centrée sur le **GPS magasin** : guider l'utilisateur pendant ses courses, solo ou en groupe, **sans partenariat enseigne** au lancement. Les solutions industrielles (Mappedin, Oriient, Aisle411) exigent des plans CAD et des contrats. Un GPS smartphone standard ne fonctionne pas sous toit métallique (précision > 50 m).

Nous avons déjà une taxonomie de 9 rayons et un tri par `sortOrder` (`packages/shared/src/shopping-aisles.ts`).

## Décision

Adopter une **navigation hybride en 4 couches**, **toutes livrées dans la v2** (release unique, pas de v2.0 / v2.1…) :

1. **Parcours par rayons** — graphe abstrait + profils magasin (hyper / super / proxi) ; un rayon à la fois en plein écran.
2. **Ancrage magasin** — GPS extérieur + géofence + POI OSM (`shop=supermarket`) ; session **locale** (AsyncStorage).
3. **PDR léger** — podomètre + pas/virages (`expo-sensors`), téléphone en main ; **recalage** à chaque article coché.
4. **Crowdsourcing** — lot à la validation (pas à chaque coche) : emplacement trouvé, rupture, mauvais pin, recalage position ; `ContributorTrust` pondère l’agrégation.

Le moteur de route (ordre des rayons, items par étape) vit dans **`packages/store-navigation`** (TypeScript pur, testé à 80 %+). L'UI mobile consomme ce package. **Capteurs + PDR + session magasin = côté app** (mémoire / AsyncStorage). La BDD existante (`ShoppingItem`) suffit pour la synchro groupe ; les contributions communautaires ajoutent `StoreContributionBatch` / `ContributorTrust` (pas d’envoi unitaire à chaque coche).

**Plan 2D schématique en v2** (templates allées + chemin tracé + point utilisateur estimé via PDR) — pas de plan CAD officiel enseigne. Les contributions Waze affinent le layout et les emplacements produit **par magasin** au fil de l’usage.

## Alternatives rejetées

- **SDK Mappedin / Oriient** : qualité élevée mais coût, contrats enseignes, hors scope indie.
- **GPS indoor seul** : imprécis sous toit ; rejeté comme source primaire.
- **Scrape plans magasins** : fragile, ToS, pas de source ouverte fiable en France.
- **Découpage v2.0 / v2.1 / v2.2** : rejeté — Steve veut **tout dans la v2** ; ordre d'implémentation interne seulement.

## Conséquences

- ✅ Scope produit cohérent : une v2 = expérience GPS magasin complète.
- ✅ Chemin crédible vers sensation « GPS » (PDR + recalage) sans infra magasin.
- ✅ Base données pour amélioration communautaire (Waze).
- ⚠️ Précision spatiale limitée jusqu'à masse de contributions.
- ⚠️ `expo-sensors` / PDR : calibration variable selon appareils ; UX doit rester honnête (« estimation »).
- 🔄 À revoir si partenariat enseigne ou import plans CAD devient possible.
