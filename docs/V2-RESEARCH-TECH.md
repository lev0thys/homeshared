# Recherche technique v2 — GPS magasin (feature principale)

> **Décision produit** : le GPS magasin est la **fonctionnalité #1 de la v2** (`docs/V2-VISION.md`).  
> Ce document expose les options techniques pour l’implémenter (état de l’art, capteurs, algo, projets existants).  
> **Plan d'exécution** : `docs/V2-GPS-IMPLEMENTATION.md` · **Décision archi** : ADR-006.

---

## 1. Cartographie des approches possibles

Le « GPS des courses » peut signifier des choses **très différentes** techniquement. Ce ne sont pas des variantes du même chantier :

| Niveau | Ce que l’utilisateur perçoit | Données nécessaires | Faisabilité indie / sans partenaire |
|--------|------------------------------|---------------------|-------------------------------------|
| **A** | Liste triée par **rayons génériques** (fruits → frais → épicerie) | Taxonomie produit → rayon | ✅ Déjà en place (v1) |
| **B** | **Parcours guidé** : un rayon à la fois, progression, mode plein écran | A + ordre de parcours par **profil magasin** | ✅ Faisable v2.0 |
| **C** | **Magasin identifié** : « Vous êtes au Leclerc X » | POI + géoloc **extérieur** / géofence parking | ✅ Faisable (opt-in) |
| **D** | **Plan 2D** du magasin avec trajet dessiné | Graphe allées + coordonnées zones | ⚠️ Partiel : layouts manuels ou crowdsourcing |
| **E** | **Point bleu** qui avance dans l’allée (GPS indoor) | BLE, Wi‑Fi RTT, IMU, plan CAD, ou SDK type Oriient | ❌ Très coûteux / partenaire |
| **F** | **Emplacement produit** (« le riz est allée 7, étagère B ») | Référentiel SKU ↔ emplacement par magasin | ⚠️ Waze communautaire ou scrape drive / partenaire |

**Constat industrie** : Walmart, Home Depot, Kroger, Walgreens ont intégré plans + numéros d’allée via **contrats** (Aisle411, Mappedin, Oriient, Point Inside) — pas via une base ouverte type OpenStreetMap routier.

---

## 2. Ce que homeshared a déjà (base technique)

### 2.1 Rayons & parcours générique

Fichier `packages/shared/src/shopping-aisles.ts` :

- 9 rayons (`PRODUCE`, `BAKERY`, `MEAT`, …) avec `sortOrder` (parcours hyper FR).
- Inférence rayon : catégorie ingrédient catalogue **ou** regex sur le libellé libre.
- `groupItemsByStoreAisle()` : regroupe et trie la liste pour l’UI courses.

→ C’est le **niveau A** ; la v2 peut monter en **B** sans nouvelle source de données externe.

### 2.2 Modules par groupe

`packages/shared/src/group-features.ts` :

- Features : `SHOPPING`, `FRIDGE`, `RECIPES`, `TASKS`, `BARBECUE`.
- Défaut création groupe : shopping + frigo + recettes.
- API + onglets conditionnels côté mobile.

→ Base pour la **modularité**, mais aujourd’hui au **niveau groupe**, pas **préférences utilisateur** globales (onboarding « pourquoi vous avez installé l’app »).

### 2.3 Catalogue magasins (prototype)

`apps/api/prisma/data/store.catalog.ts` :

- Mock Leclerc / Auchan / Carrefour, prix indicatifs, liens **recherche** drive (pas panier API).
- Commentaire explicite : pas d’API officielle, candidat OFF / partenariat v2.

→ Comparateur prix / deep link recherche, **pas** cartographie indoor.

### 2.4 Achats & latence

`shopping.tsx` : `POST /purchase` puis `invalidateQueries` (shopping + fridge + recipes).

→ Optimistic UI = chantier mobile pur (TanStack Query), indépendant du GPS.

### 2.5 Géoloc

**Aucune** dépendance `expo-location` aujourd’hui. Tout est à ajouter.

---

## 3. Géolocalisation — technologies & limites

### 3.1 GPS extérieur (smartphone standard)

| Capacité | Précision typique | Usage homeshared |
|----------|-------------------|------------------|
| Position courante | 5–20 m (ciel ouvert) | « Magasins à proximité » |
| Géofence entrée parking | ~50–200 m rayon | Proposer « Mode courses » |
| Suivi continu en magasin | **Mauvais** sous toit métallique | Ne pas compter dessus pour les rayons |

**Stack** : `expo-location` (Expo 51) — compatible APK EAS, pas Expo Go pour tâches background avancées.

### 3.2 Géofencing (Expo)

- Android : jusqu’à **100** régions / app ; événements **batchés** toutes les quelques minutes en arrière-plan (API 26+).
- iOS : **20** régions max ; `Always` location + `UIBackgroundModes: location`.
- Android : si l’user **tue** l’app (swipe), les events géofence **ne relancent pas** l’app (contrairement à iOS dans certains cas).
- Web/PWA : `navigator.geolocation` — permission par onglet ; iOS Safari restrictif ; **pas** de géofence background fiable.

**Implication** : détecter « je suis arrivé au magasin » = réaliste en **foreground** (user ouvre mode courses) ou géofence **approximative**, pas tracking continu en rayon.

### 3.3 GPS indoor (sans infrastructure magasin)

Techniques étudiées en recherche / industrie :

| Techno | Principe | Précision | Coût infra | Sans partenaire ? |
|--------|----------|-----------|------------|-------------------|
| **GNSS seul** | Satellites | >10–50 m indoor | 0 | ❌ Insuffisant |
| **Wi‑Fi fingerprinting** | Carte RSSI pré-enregistrée | 2–5 m | Élevé (survey + maintenance) | ⚠️ Labo seulement |
| **BLE beacons** | Balises fixes | 2–3 m | Moyen (déploiement magasin) | ❌ |
| **UWB** | Ultra-wideband | <1 m | Élevé | ❌ |
| **PDR / IMU** (podomètre + gyro) | Dead reckoning depuis l’entrée | Dérive en minutes | 0 | ⚠️ Dérive rapide, pas « GPS » |
| **Champ magnétique / acoustique** | SLAM recherche | Sub-mètre en labo | 0 capteur fixe | ❌ Pas produit grand public |
| **SDK Oriient / Mappedin** | Fusion capteurs + plan propriétaire | 2–3 m | Licence B2B | ❌ Partenaire / licence |

**Synthèse académique** (surveys 2023–2026) : le fingerprinting Wi‑Fi/BLE demande des **milliers d’échantillons par point** et se dégrade dès qu’on déplace un rayon. Les approches **hybrides BLE + inertiel** sont le standard retail commercial — pas le modèle Waze open.

### 3.4 GPS + podomètre / IMU (PDR — dead reckoning)

**Oui, on peut combiner** GPS (dehors) et podomètre + capteurs inertiels (dedans) — c’est le modèle **PDR** (Pedestrian Dead Reckoning) étudié en recherche indoor.

| Brique | Rôle en magasin | Stack homeshared possible |
|--------|-----------------|---------------------------|
| **GPS** | Ancrage : « entrée magasin ≈ ce point » | `expo-location` (foreground) |
| **Podomètre** | Nombre de pas → distance parcourue | `Pedometer` dans `expo-sensors` |
| **Accéléromètre / gyro** | Détection pas, turns (virages) | `Accelerometer`, `DeviceMotion` |
| **Magnétomètre** | Cap (orientation N/S/E/O) | `Magnetometer` — **peu fiable** près frigos/métal |
| **Baromètre** | Étage (mall) | Peu utile en hyper plain-pied |

**Chaîne simplifiée** :

```
Entrée (GPS) → position de départ sur graphe magasin
  + à chaque pas : distance += stepLength (≈ 0,65–0,75 m, calibrable)
  + à chaque virage détecté : mettre à jour le cap
  → position estimée sur le graphe (allées = nœuds)
  + à chaque « trouvé » (cocher article) : recaler sur le rayon déclaré (ancre sémantique)
```

**Limites importantes** :

- **Dérive** : sans recalage, l’erreur cumule (souvent **plusieurs mètres en 2–3 min**).
- **Comportement courses** : arrêts, panier, téléphone en poche, scan → pas réguliers.
- **Interférences** : champs magnétiques (chambres froides) faussent la boussole.
- **Expo** : `Pedometer.watchStepCount` **ne tourne pas en arrière-plan** — le « mode magasin » doit être **écran actif** (cohérent avec usage en courses).
- **iOS** : historique pas limité à ~7 jours pour `getStepCountAsync` ; le live = session ouverte.

**Ce que ça donne en produit** (sans partenaire) :

- Pas un **point bleu** précis type Google Maps indoor.
- Plutôt : **« vous avez parcouru ~40 m, prochain rayon estimé : Frais »** + recalage à chaque coche.
- Hybride puissant : **PDR + graphe rayons** (`shopping-aisles`) + **contributions** au cocher.

**Références** : PDR + map-matching sur graphe indoor (littérature ISI/IIETA, MDPI navigation 2024) ; fusion gyro + accel (filtres complémentaires / Kalman) si on va plus loin qu’un simple compteur de pas.

### 3.5 Données « magasin » sans géoloc indoor

| Source | Contenu | Licence / coût | Indoor ? |
|--------|---------|----------------|----------|
| **OpenStreetMap** | `shop=supermarket`, parfois `brand`, adresse, horaires | ODbL (attribution) | Rarement plans intérieurs détaillés |
| **Overpass API** | Requête POI autour d’un point | Gratuit | Non |
| **Google Places** | Nom, coords, horaires, parfois popular times | Payant ($/1000 req) | Pas plan allées |
| **Nominatim** | Géocodage adresse | Gratuit (usage modéré) | Non |
| **OpenStreetMap indoor tagging** | `indoor=area`, `barrier=shelf` | Communautaire, inégal | Théorique ; peu de hypers FR complets |

Forum OSM (supermarchés DE) : consensus = mapper des **zones** (« produits laitiers ») plutôt que chaque **rayon** ; les enseignes réorganisent souvent.

---

## 4. Optimisation de parcours (algorithmes)

### 4.1 Modèle mathématique

Le parcours courses est un **OTSP** (Open Traveling Salesman Problem) :

- Départ : entrée magasin.
- Visiter : ensemble de **rayons** (ou nœuds graphe) contenant les articles.
- Arrivée : caisses (optionnel).
- NP-difficile ; heuristiques suffisent pour <15 rayons.

Recherche Wharton (Hui et al., 2009) sur vrais paniers : une grande part de la distance vient de l’**écart au chemin optimal** (comportement humain), pas seulement de l’ordre des catégories.

### 4.2 Implémentations open source / hackathons

| Projet | Stack | Approche | Maturité |
|--------|-------|----------|----------|
| **[shoptimize](https://github.com/reshinto/shoptimize)** | React, Redux, canvas | Graphe grille + **Dijkstra** ; layouts magasins **hardcodés** par enseigne | PoC, layouts manuels |
| **[TheTravellingGrocer](https://github.com/aditya-adiraju/TheTravellingGrocer)** | MEAN, TS | **Mappedin SDK** + TSP / WASM | Hackathon 2024, dépend SDK commercial |
| **Stack Overflow / heuristiques** | — | A* entre points + greedy nearest-neighbor | Suffisant si graphe petit |

**Papier récent** (MDPI 2024) : tri dynamique par **proximité** avec ré-ancrage à chaque article coché — très aligné avec l’idée « GPS qui se recalcule » sans carte indoor.

### 4.3 Pistes pour homeshared

1. **Graphe abstrait** : nœuds = rayons (`StoreAisleId`), arêtes = coût selon **profil layout** (hyper L, hyper U, proximité linéaire).
2. **Ordre de visite** : tri par `sortOrder` modifiable par profil ; option TSP heuristique si on ajoute des « couloirs transversaux ».
3. **Recalcul dynamique** : à chaque coche, prochain rayon = plus proche dans le graphe restant (papier MDPI).
4. **Pas besoin de GPS** pour les niveaux A–B ; la géoloc sert surtout à **lier la session** à un magasin OSM (niveau C).

---

## 5. Mode « Waze » — contributions utilisateurs

### 5.1 Ce que Waze routier fait (analogie)

- Beaucoup d’users → traces GPS agrégées sur **réseau connu** (OpenStreetMap / Google).
- Événements ponctuels (radar, accident) = faible précision spatiale suffisante.

### 5.2 Pourquoi c’est plus dur en magasin

| Défi | Détail |
|------|--------|
| **Pas de graphe public** | Allées non dans OSM de façon fiable |
| **Layout par magasin** | Même enseigne : plan différent selon ville / taille |
| **Produit ≠ coordonnée** | « Riz » change d’allée selon promo / saison |
| **Signal indoor** | Pas de trace GPS fiable pour fusionner |
| **Cold start** | Premier user sur un magasin = zéro donnée |
| **Spam / qualité** | Faux placements, trolls |

### 5.3 Modèles de contribution réalistes (sans partenaire)

| Granularité | Donnée collectée | Moment | Faisabilité |
|-------------|------------------|--------|-------------|
| **G1 — Rayon** | « J’ai trouvé X dans rayon DAIRY » | Au cocher achat | ✅ Facile |
| **G2 — Ordre allées** | Séquence des rayons visités (timestamps) | Fin de session | ✅ Agrégation statistique |
| **G3 — Position relative** | « Après les fruits, tournez à droite » | Feedback volontaire | ⚠️ UX lourde |
| **G4 — Plan 2D** | Polygones allées | Contribution expert / employé | ⚠️ Rare |
| **G5 — SKU ↔ emplacement** | Scan EAN + « ici » | Scan code-barres | ⚠️ Nécessite `expo-barcode-scanner` + catalogue |

**Schéma données (piste)** :

```
Store (osm_id, brand, lat, lng)
  └── StoreLayout (version, profile: hyper|super|proximity, source: community|manual)
        └── Zone (aisleId, polygon? | sortHint)
              └── PlacementAggregate (ingredientSlug, confidence, sampleCount)
```

Pas de lat/lng indoor au début — plutôt **ordre** et **fréquence** par `(store, aisle, product)`.

### 5.4 Alternatives au crowdsourcing pur

| Approche | Description | Légalité / risque |
|----------|-------------|-------------------|
| **Scrape drives** | Pages Leclerc Drive classent par « rayon » textuel | ToS souvent interdits ; fragile |
| **Open Food Facts** | EAN, marque, catégorie — **pas** emplacement magasin | OK libre |
| **Prix / recherche** | Déjà `store.catalog.ts` (mock) | Liens recherche uniquement |
| **Employés / ambassadeurs** | Seed manuel des 50 magasins les plus fréquents | Opérationnel, pas scalable seul |

---

## 6. Solutions commerciales (référence, pas v2.0 Steve)

| Acteur | Offre | Modèle |
|--------|-------|--------|
| **Mappedin** | Cartes indoor, SDK, routing pour grocery | B2B licence |
| **Oriient** | « Indoor GPS » sans hardware (magnetic + inertiel) | B2B |
| **Aisle411** | Historique Walgreens — listes + plan | B2B / racheté |
| **Point Inside** | Meijer, item locator | B2B |
| **Aislefinder** | Appel magasins un par un (~5300 US) | Manuel, US |

Utile comme **benchmark UX**, pas comme brique intégrable gratuitement.

---

## 7. Onboarding modulaire — options techniques

Objectif Steve : intentions au 1er lancement + frigo lié oui/non + réactivation plus tard.

| Couche | Option A | Option B |
|--------|----------|----------|
| **Stockage** | Champs `User.preferences` JSON en DB | Table `UserModulePreference` |
| **Scope** | Préférences **utilisateur** globales | Par espace/groupe en plus |
| **Sync** | `enabledModules` user ∩ `Group.features` | Masquer onglet si absent des deux |
| **Frigo** | `linkShoppingToFridge: boolean` | Désactive mutation API frigo côté serveur si false |
| **Re-onboarding** | Écran réglages « Reconfigurer » | Même flow qu’au 1er launch |

**Pattern apps comparables** : Notion (templates), Todoist (workspaces), Google apps (sélection services) — pas de standard unique ; souvent **feature flags** + **progressive disclosure**.

**Liens métier préservés** : si frigo off, `purchase` API peut soit (1) ne pas créer `FridgeItem`, soit (2) créer mais masquer UI — (1) plus simple RGPD / attentes user.

---

## 8. Matrice de faisabilité (effort vs impact)

| Chantier | Effort | Impact UX | Dépendances externes |
|----------|--------|-----------|----------------------|
| Optimistic UI courses | S | 🟢 | Aucune |
| Onboarding modules | M | 🟢 | Migration DB légère |
| Mode magasin niv. B (guidage rayons) | M | 🟢 | `shopping-aisles` |
| Profils layout hyper/super/proxi | M | 🟡 | Design + données |
| Géoloc proximité magasin (niv. C) | M | 🟡 | `expo-location`, RGPD |
| OSM Overpass liste magasins | S | 🟡 | ODbL attribution |
| Contributions G1 (rayon au cocher) | M | 🟡 | Modèle Store + API |
| Graphe 2D + Dijkstra (shoptimize-like) | L | 🟡 | Layouts manuels par magasin |
| GPS indoor / point bleu | XL | 🟢 si réussi | Partenaire ou BLE |
| Partenariat enseigne | XL+ | 🟢 | Business |

L = plusieurs semaines ; M = jours–1 semaine ; S = heures–2 jours.

---

## 9. Packs techniques envisageables (non exclusifs)

### Pack « Quick wins » (v2.0)

- Optimistic purchase
- Onboarding intentions + modules
- Écran Mode magasin (rayon par rayon, progression)
- Profil layout `HYPER_FR_DEFAULT` unique

### Pack « Magasin identifié » (v2.1)

- `expo-location` foreground
- Overpass : magasins `shop=supermarket` dans 2 km
- Session `ShoppingTrip` liée à `storeOsmId`
- Contributions G1 + G2
- Option **PDR léger** : podomètre session + distance parcourue + virages grossiers (sans promettre point bleu)

### Pack « Carte communautaire » (v2.2+)

- Agrégation placements
- Édition layout communautaire modérée
- Scan EAN (OFF) pour affiner produit

### Pack « Partenaire » (si un jour)

- Import Mappedin / API enseigne
- SKU officiels

---

## 10. Risques & contraintes homeshared

| Risque | Mitigation |
|--------|------------|
| Promettre « GPS » comme Waze routier | Vocabulaire produit : « parcours guidé » / « étapes » |
| Batterie (background loc) | Loc uniquement en mode magasin actif |
| Apple review (background location) | Justification claire dans App Store review notes |
| Web PWA sans géoloc | Parcours + choix magasin manuel |
| Taille APK | `expo-location` = module natif raisonnable |
| Données OSM incomplètes en rural | Fallback saisie manuelle enseigne |

---

## 11. Références & liens utiles

### Projets code

- [shoptimize](https://github.com/reshinto/shoptimize) — Dijkstra + layouts grille
- [TheTravellingGrocer](https://github.com/aditya-adiraju/TheTravellingGrocer) — Mappedin + TSP

### Docs & APIs

- [Expo Location](https://docs.expo.dev/versions/latest/sdk/location/) — permissions, geofencing
- [OSM shop=supermarket](https://wiki.openstreetmap.org/wiki/Tag:shop%3Dsupermarket)
- [OSM Simple Indoor Tagging](https://wiki.openstreetmap.org/wiki/Simple_Indoor_Tagging)
- [Overpass API](https://wiki.openstreetmap.org/wiki/Overpass_API)

### Recherche

- Hui et al. (2009) — TSP et comportement réel en supermarché
- MDPI (2024) — tri dynamique proximité, ré-ancrage à chaque article
- Surveys indoor localization smartphone (WiFi/BLE/IMU, 2023–2026)

### Industrie

- [Mappedin Grocery](https://www.mappedin.com/industries/grocery/)
- [Oriient indoor navigation retail](https://www.oriient.me/from-store-maps-to-real-time-navigation-3/)

---

## 12. Suite documentaire

- `docs/V2-VISION.md` — vision produit Steve
- `BACKLOG.md` — entrées v2 priorisées
- Prochain livrable technique suggéré : **ADR-00X** « Modèle de données magasin & contributions » + wireframes mode magasin niv. B
