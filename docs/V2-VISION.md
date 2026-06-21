# Vision v2 — homeshared

> Document de cadrage — mis à jour après échanges Steve (2026-06-10).

## ★ Fonctionnalité principale v2 : **GPS magasin**

**Décision produit (Steve)** : la v2 = **le GPS des courses en magasin**. Ce n’est pas un optionnel ni un « plus » — c’est le cœur de la release.

Tout le reste (menus simplifiés, liste partagée, frigo, recettes, notifications…) **sert ou entoure** cette expérience :

- **Avant le magasin** : préparer / partager la liste.
- **En magasin** : mode navigation — prochain rayon, progression, parcours optimisé, GPS + podomètre (PDR) + contributions communautaires — **tout livré dans la v2**.
- **Après** : frigo / recettes si l’utilisateur les a activés.

Critère de succès v2 : un utilisateur peut dire *« homeshared me guide dans le magasin »*, pas seulement *« homeshared gère ma liste »*.

→ Faisabilité technique détaillée : **`docs/V2-RESEARCH-TECH.md`**.  
→ Plan d’exécution : **`docs/V2-GPS-IMPLEMENTATION.md`**.

---

## Parcours utilisateur v2 (Steve)

### Avant le magasin
1. L’utilisateur prépare sa **liste de courses** (solo ou groupe).
2. Quand la liste est prête, un bouton primaire : **« Je suis au magasin »** (ou équivalent).

### Au magasin — plan 2D
3. L’app passe en **mode navigation** : **plan schématique 2D** du magasin.
4. L’utilisateur est placé à **l’entrée** (GPS parking + confirmation).
5. Un **chemin optimal** est tracé sur le plan pour récupérer tous les articles de la liste (ordre des rayons / allées).
6. Le **point utilisateur** avance sur le plan (PDR : pas + virages), recalé à chaque produit coché.
7. Panneau bas : articles du **rayon courant** à cocher.

### Actions utilisateur en magasin
8. **Recalage position** : long-press sur le plan → **« Je suis ici »** si le parcours a dérivé (PDR imprécis).
9. **Rupture de stock** : signaler qu’un produit n’est plus disponible à l’emplacement attendu.
10. **Mauvais emplacement** : contester un pin communautaire (produit mal placé par la foule).

### Communauté — batch + confiance
11. Pendant la session : cocher = courses (API) + **brouillon local** (position théorique, signalements).
12. À la **validation** (fin de rayon ou fin de courses) → **un seul envoi** BDD par lot, signé utilisateur.
13. **Score de confiance interne** : contributeurs alignés avec la majorité gagnent en poids ; outliers répétés sont pondérés moins ; jamais affiché à l’user.
14. Plus le magasin est utilisé, plus les emplacements affichés sont fiables.
15. **Premier sur ce magasin** : message clair + incitation à signaler plan incorrect, ruptures, mauvais emplacements — sans bloquer l’expérience.

**Ce qu’on ne promet pas** : plan officiel Leclerc/Carrefour au mètre près. On part de **layouts de base** (hyper / super / proxi) puis on **améliore avec la foule**.

### Sources du rayonnage « de base »
| Priorité | Source | Contenu |
|----------|--------|---------|
| 1 | **Templates homeshared** | Allées + couloirs schématiques par profil (hyper en U, super linéaire, proxi compact) |
| 2 | **OSM indoor** (si dispo) | Zones / allées taguées autour du POI magasin |
| 3 | **Inférence enseigne** | Leclerc hyper vs Express → choix du template |
| 4 | **Contributions** | Ordre des allées, corrections layout, emplacements produits |

---

## Décisions produit (Steve)

| Sujet | Choix |
|-------|--------|
| **Scope v2** | **GPS magasin** = feature #1 ; le reste est secondaire ou support |
| **Qui ?** | **Solo et groupe** — même app : liste perso ou liste partagée foyer/coloc |
| **Partenariats enseignes** | **Non en priorité** — trop compliqué pour démarrer ; à garder en option lointaine |
| **Scope GPS v2** | **Tout en une release** : parcours rayons + géoloc magasin + PDR (capteurs) + Waze communautaire ; archi client-first, BDD minimale |
| **Performance v2** | Cache local, moins d’invalidations serveur, snapshot mode magasin, rate limits anti-spam — fluidité + coûts maîtrisés à la croissance |
| **Ambition** | Plan **2D schématique** + chemin optimal + point utilisateur ; sans plan CAD officiel enseigne |
| **Communauté** | Batch à la validation ; rupture / mauvais emplacement ; confiance interne pondère les votes |
| **Recalage** | Manuel « Je suis ici » sur le plan 2D |
| **CTA magasin** | Bouton **« Je suis au magasin »** après préparation de la liste |
| **Modules** | **Ne pas couper les liens** (courses → frigo → recettes) ; rendre le reste **opt-in / discret** si l’user ne s’en sert pas |
| **Navigation / menus** | **Simplification** pour mettre le mode magasin en avant ; onboarding intentions = à arbitrer plus tard |
| **Géoloc** | **Oui, partiellement** — détecter le magasin à proximité (opt-in) ; pas de position précise dans les rayons sans infra lourde |

---

## 1. Onboarding : « Pourquoi avez-vous installé l’app ? »

**Objectif** : adapter l’app dès l’arrivée (après inscription / 1ère connexion), pas seulement via les réglages.

### Écran 1 — Intentions (multi-choix ou carte)

Exemples de réponses (libellés à peaufiner) :

- 🛒 **Listes de courses** (seul ou en famille)
- 🧊 **Suivre ce qu’il y a au frigo**
- 🍳 **Idées repas / recettes**
- ✅ **Tâches du foyer**
- 👥 **Partager avec coloc / famille**

→ Pré-sélectionne les modules ; **courses** peut rester toujours disponible.

### Écran 2 — Lier le frigo ? (question clé Steve)

> « Quand vous cochez un article au magasin, voulez-vous l’ajouter automatiquement au frigo ? »

| Réponse | Effet |
|---------|--------|
| **Oui** | Module frigo **activé** ; achat → frigo ; recettes « avec ce que j’ai » visibles |
| **Non** | Module frigo **masqué** de la nav ; pas de bascule auto ; courses restent autonomes |
| **Plus tard** | = Non pour l’instant ; rappel possible après N courses |

**Réactivation** : Profil → « Mes fonctionnalités » → activer Frigo / Recettes / Tâches / Chat.

### Stockage technique (piste)

- `UserPreferences` ou champs profil : `enabledModules[]`, `linkShoppingToFridge: boolean`
- Aligné avec `Group.features[]` pour les espaces partagés
- Onboarding rejouable depuis les réglages (« Reconfigurer mon usage »)

*Backlog* : `[v2] Onboarding intentions + modules activables`.

---

## 2. Séparation des fonctionnalités (sans découpler le métier)

**Objectif** : quelqu’un qui cherche « une app de liste de courses » doit se sentir chez lui **sans être noyé** par frigo, recettes, tâches, etc.

### Principes UX

| Principe | Détail |
|----------|--------|
| **Focus configurable** | Réglage ou onboarding : « J’utilise surtout les courses » → accueil = liste + mode magasin |
| **Modules visibles mais calmes** | Frigo / recettes / tâches accessibles (menu secondaire, onglet « Plus ») — pas supprimés |
| **Liens préservés** | Ex. article coché → *proposition* « Ajouter au frigo ? » (défaut selon profil) ; recettes peuvent toujours lire le frigo si activé |
| **Solo = liste perso** | Espace personnel existant ; partage = inviter dans un groupe sans jargon inutile |
| **Groupe = liste partagée** | Temps réel, chat, tâches — pour ceux qui veulent le hub foyer |

### Navigation après onboarding

- **Accueil** = ce que l’user a choisi (souvent Courses en premier)
- **Onglets / menu** : uniquement les modules **activés**
- **Plus** ou **Profil → Fonctionnalités** : réactiver frigo, recettes, etc.
- **Mode magasin** : plein écran, guidage par rayons

---

## 3. Géolocalisation — ce qu’on peut (et ne peut pas) faire

### Oui, on peut récupérer la position (avec accord utilisateur)

| Usage | Faisable ? | Technique |
|-------|------------|-----------|
| Savoir si l’user est **près d’un magasin** (parking / entrée) | ✅ Oui | `expo-location` + géofence ~100–300 m ; base magasins OSM / Google Places / saisie user |
| Proposer « **Démarrer le mode courses** ici ? » | ✅ Oui | Détection proximité + confirmation user |
| Enregistrer **quel magasin** pour contributions Waze | ✅ Oui | Magasin = point GPS + nom (pas besoin d’être dedans au mètre près) |
| **GPS dans les rayons** (où suis-je dans l’allée ?) | ❌ Non fiable | GPS indoor très imprécis sous toit ; pas de BLE / plan sans partenaire |
| Web / PWA | ⚠️ Partiel | API navigateur OK ; iOS PWA plus restrictif ; demander permission à l’usage |

### Stratégie v2 recommandée

1. **Opt-in explicite** (« Utiliser ma position pour le mode magasin ») + mention privacy policy (RGPD).
2. **Hors magasin** : pas de tracking continu — seulement au lancement du « mode courses » ou en arrière-plan léger géofence (à arbitrer batterie).
3. **Sans géoloc** : l’user **choisit son magasin** à la main → le parcours rayons fonctionne quand même.
4. **Mode Waze futur** : contributions = « dans ce magasin, rayon X, ordre Y » — pas coordonnées GPS indoor.

---

## 4. Feature principale : **GPS des courses** (sans partenaire)

### Ce qu’on veut ressentir

Comme un **GPS** : « Prochaine étape : Rayon frais → 3 articles » puis « Épicerie → 2 articles », avec sensation de **progression** dans le magasin — pas seulement une liste alphabétique.

### Ce qui est faisable **sans** partenariat ni plan officiel

| Niveau | Quoi | Complexité | v2.0 ? |
|--------|------|------------|--------|
| **0 — Déjà là (v1)** | Liste groupée par rayons génériques + ordre de parcours | — | ✅ |
| **1 — Parcours guidé** | Écran « Mode magasin » : un rayon à la fois, barre de progression, cocher optimiste | 4/10 | ✅ MVP |
| **2 — Profils magasin** | Modèles « Hyper », « Super », « Proximité » : ordre des rayons différent (pas la même géométrie) | 5/10 | v2.0 ou v2.1 |
| **3 — Waze communautaire** | À chaque « trouvé », contribution position relative (rayon + ordre dans le rayon) pour **ce** magasin | 7/10 | v2.1+ |
| **4 — GPS indoor réel** | Position mètre par mètre (BLE, plan CAD, partenaire) | 9/10 | **Hors scope** sauf pivot |

**Décision** : pas de partenariat au départ. Commencer **niveaux 1–2** ; concevoir les données pour le **niveau 3** (contributions utilisateurs) sans promettre du vrai GPS indoor tout de suite.

### Comment deviner le rayonnage sans enseigne

- Taxonomie **rayons génériques** (`shopping-aisles` : fruits, viande, frais, épicerie…)
- Règles nom produit → rayon (déjà en place)
- **Profils de parcours** : ordre type d’un hyper français (entrée → frais → sec → caisse) — réglable
- Plus tard : base « ce magasin » alimentée par les users (entrée magasin détectée ou sélection manuelle enseigne + ville)

### Voie partenariat (backlog, pas v2.0)

Plans officiels Carrefour / Leclerc / etc. — **reporté** tant que le mode communautaire + rayons génériques ne prouvent pas l’usage.

---

## 5. Notifications & activité

- Nouvelle **tâche**, **message** groupe, changement **liste partagée**
- Préférences par type (ne pas spammer un user « courses seules »)
- Push + centre in-app

---

## 6. Dette v1 → v2

- Cocher article → **optimistic UI**
- Refonte navigation / espaces
- AdSense web (optionnel)

---

## 7. Questions encore ouvertes (Steve)

1. **Profil magasin par défaut** : hyper classique suffit pour le MVP ?
2. **Onboarding** : écran intentions = **une** réponse ou **plusieurs** cochables ?
3. **Géoloc** : proposer dès l’onboarding ou seulement au 1er « Mode magasin » ?
4. **Notifications** : lesquelles sont **indispensables** en v2.0 ?

---

## Prochaines étapes

1. Steve : répondre aux §7 (ou compléter dans ce fichier).
2. Lire **`docs/V2-RESEARCH-TECH.md`** — faisabilité géoloc, Waze, algo parcours, projets existants.
3. Agent : wireframes + ADR modèle données magasin.

## Voir aussi

- **`docs/V2-RESEARCH-TECH.md`** — recherche technique approfondie (géoloc, indoor, OSM, TSP, crowdsourcing, stack Expo).
