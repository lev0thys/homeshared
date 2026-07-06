# Play Console — corriger les erreurs avant publication

**AAB actuel (API 34)** : à remplacer après rebuild API 35.

Nouveau build :
```powershell
cd homeshared/apps/mobile
eas build --profile production --platform android --non-interactive
```

---

## 1. Description complète manquante

**Menu** : Présentation sur le Play Store → Fiche Play Store principale → **Français (France)**

Colle la **description complète** (champ long, pas la courte) :

```
homeshared simplifie la vie du foyer : une seule app pour organiser courses, frigo, repas et tâches ensemble.

• LISTE DE COURSES PARTAGÉE — chaque membre ajoute ce qu'il faut. Au magasin, cochez les articles ; ils basculent dans le frigo du groupe.

• FRIGO VIRTUEL — stocks, dates de péremption, réservations repas.

• RECETTES & PLANNING — suggestions selon le frigo, repas de la semaine, ingrédients manquants en un clic.

• TÂCHES MAISON — répartir courses, ménage, préparation des repas.

• GROUPES — foyers, colocs, familles ; invitation par lien.

• SYNC TEMPS RÉEL — mises à jour instantanées pour tous les membres.

• WIDGETS ANDROID — courses et frigo sur l'écran d'accueil.

Gratuit avec publicités discrètes. Comptes enfant supportés.

Politique de confidentialité : https://homeshared.vercel.app/privacy
```

**Enregistrer** la fiche.

---

## 2. Pays / régions

**Menu** : Production → **Pays et régions** (ou lors de la création de release → onglet pays)

- Coche au minimum **France**
- Ou **Ajouter tous les pays** si tu veux une diffusion mondiale

---

## 3. Fonctionnalités financières

**Menu** : Contenu de l'application → **Fonctionnalités financières**

Réponse : **Non**, mon application n'inclut pas de fonctionnalités financières.

(homeshared = pas de paiement, pas de crypto, pas de trading)

---

## 4. Déclaration santé

**Menu** : Contenu de l'application → **Applications de santé** / **Déclaration santé**

Réponse : **Non**, ce n'est pas une application de santé.

L'app gère courses / repas / foyer — pas un dispositif médical ni un suivi santé réglementé.

---

## 5. Photos et vidéos (permission galerie)

**Menu** : Contenu de l'application → **Autorisations photos et vidéos** (ou Déclaration permissions)

| Question | Réponse |
|----------|---------|
| L'app accède photos/vidéos ? | **Oui** (avatar profil) |
| Fonctionnalité **principale** de l'app liée aux photos ? | **Non** |
| Usage | **Photo de profil (avatar)** choisie par l'utilisateur dans les réglages |

Texte à coller si champ libre :

> Accès à la galerie uniquement pour que l'utilisateur choisisse une photo de profil. Ce n'est pas la fonctionnalité principale. L'app fonctionne sans avatar personnalisé.

---

## 6. Tableau de bord (toutes les tâches)

**Menu** : Tableau de bord → compléter **chaque** élément non coché :

| Tâche | Où | Valeur homeshared |
|-------|-----|-------------------|
| Politique confidentialité | Contenu app | `https://homeshared.vercel.app/privacy` |
| Publicités | Contenu app | **Oui** |
| Classification contenu | Contenu app | Questionnaire → Style de vie |
| Public cible | Contenu app | Selon questionnaire (souvent 13+ ou Tous publics) |
| Sécurité des données | Contenu app | Email, compte, pas vendu à des tiers |
| Icône + captures | Fiche store | `play-store/icon-512.png` + captures **réelles** |
| Feature graphic | Fiche store | `play-store/feature-graphic.png` |

---

## 7. API 35 (code corrigé — nouveau AAB requis)

Erreur : *« cible API 34, minimum API 35 »*

**Corrigé dans** `apps/mobile/app.config.js` (`targetSdkVersion: 35`).

**Tu dois** :
1. Lancer un **nouveau** `eas build --profile production --platform android`
2. Télécharger le **nouveau .aab**
3. Créer une **nouvelle release** Production (ou remplacer le bundle) avec ce AAB

---

## Ordre recommandé

1. Compléter **toutes** les déclarations (sections 1–6)
2. **Rebuild AAB** API 35
3. Upload nouveau AAB + notes de version
4. Sélectionner **pays**
5. **Examiner** → **Déployer en production**

---

## Validation

Quand tout est vert dans le tableau de bord, la release peut partir en production (review Google 24–72 h).
