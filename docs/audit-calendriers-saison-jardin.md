# Audit calendriers saison & jardin (mai 2026)

**Références comparées :**
- [Manger Bouger — calendrier de saison](https://www.mangerbouger.fr/manger-mieux/bien-manger-sans-se-ruiner/calendrier-de-saison) (Santé publique France)
- [ADEME — fruits et légumes de saison](https://agirpourlatransition.ademe.fr/particuliers/mieux-consommer/alimentation/calendrier-fruits-legumes-saison)
- Jardin : semis/plantation tomate, saints de glace (mi-mars → mi-mai plantation selon région)

**Périmètre données :** `apps/api/prisma/data/season.produce.ts`, `garden.calendar.ts`  
**Non couvert :** l’onglet « De saison » du planning repas (heuristique cuisine Méditerranéenne/Salade, pas ce calendrier).

---

## Verdict global

| Calendrier | Risque de mauvais choix | Commentaire |
|------------|-------------------------|-------------|
| **Saison (consommation)** | Moyen | Trop **restrictif** (produits manquants) et quelques **faux positifs** (brocoli été). Moins dangereux que d’afficher hors saison, mais incomplet. |
| **Jardin (semis/plantation)** | Faible à moyen | Globalement **aligné** sur la pratique française ; manque surtout la **variabilité régionale** (nord vs sud). |

---

## Produits de saison — écarts majeurs

### Faux positifs (affichés chez nous alors que Manger Bouger ne les met pas en pleine saison)

| Produit | Nos mois (avant correctif) | Réf. MB | Risque |
|---------|------------------------------|---------|--------|
| Brocoli | jan, fév, **juin–nov** | Absent jan–juin ; plutôt automne/hiver | Moyen : incite à acheter hors pic local |
| (mineur) Pomme de terre | 12 mois | Souvent listée toute l’année (stockage) | Faible si présenté comme « conservation » |

### Faux négatifs (en saison chez MB, absents ou trop tard chez nous)

| Produit | MB (ex. mai) | Nos mois (avant) | Impact |
|---------|--------------|------------------|--------|
| Courgette | mai | juin–sept | Utilisateur ne la voit pas en mai |
| Concombre | mai | juin–sept | Idem |
| Asperge | avr–juin | **absent** | Trou important printemps |
| Rhubarbe | mai–juin | **absent** | Idem |
| Mûre | mai–août | **absent** | Fruits rouges incomplets |
| Tomate | dès juin (MB) | juin–sept | OK après juin ; pas en mai (cohérent) |

### Produits stockés / importés (à cadrer en UI)

- **Agrumes** (orange, citron, clémentine) : listés en hiver par MB (consommation), production souvent **hors France** → garder avec mention « souvent importé ».
- **Pomme de terre, oignon, échalote** : disponibles longtemps (stockage) → acceptable si l’app précise « conservation » ou « disponible » plutôt que « récolte locale ».

### Mai 2026 — comparaison directe

**Manger Bouger (mai) :** artichaut, asperge, carotte, chou rouge, concombre, courgette, cresson, épinard, fenouil, fraise, navet, petit pois, radis, salade, rhubarbe, mûre…

**Notre liste mai (après correctifs ciblés) :** alignée sur l’essentiel ; il manque encore cresson, oseille, pois gourmand, pamplemousse (secondaire).

---

## Calendrier jardin — écarts

| Tâche | Notre données | Références | Écart |
|-------|---------------|------------|-------|
| Semis tomate | mars–avril | Mi-mars – début avril (plaine) ; plus tôt en méditerranée | OK |
| Plantation tomate | mai | Saints de glace 11–13 mai ; nord souvent **fin mai – début juin** | Ajouter **juin** pour nord |
| Récolte tomate | juil.–oct. | Premières récoltes parfois fin juin (sud) | Acceptable |
| Plantation pomme de terre | mars–avril | Cohérent | OK |
| Ail | plantation jan–fév + oct–nov | Deux fenêtres classiques | OK |

**Recommandation UX :** afficher un bandeau « Dates indicatives — France métropolitaine ; adaptez selon votre région et la météo (gelées, température du sol ≥ 12–15 °C). »

---

## Actions recommandées

1. **Court terme (fait ou à merger)** : corriger brocoli, courgette, concombre, ajouter asperge/rhubarbe ; plantation tomate en juin ; renforcer les textes d’avertissement dans l’app.
2. **Moyen terme** : script `scripts/audit-season-calendar.mjs` + fichier référence MB par mois ; enrichir le catalogue (cresson, mûre, blettes, etc.).
3. **Backlog** : brancher les suggestions repas « De saison » sur `season.produce` + ingrédients des recettes ; option région (Nord / Sud / Méditerranée).

---

## Limites méthodologiques

- Les calendriers MB évoluent et restent **indicatifs** (serre, import, circuits courts).
- Une seule grille **France métropolitaine** ne remplace pas un conseil local (altitude, littoral).
- Ne pas présenter les données comme **prescription sanitaire** — formulation « guide indicatif » obligatoire.
