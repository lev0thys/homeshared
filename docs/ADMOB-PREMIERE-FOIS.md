# AdMob — guide débutant (homeshared)

**Objectif de ce guide** : uniquement préparer **Google AdMob** et récupérer les **2 identifiants** à mettre dans le projet.  
**Pas dans ce guide** : build APK, Play Store, Expo (on fera après).

**Durée** : 20–45 min (parfois +24 h si Google valide le compte paiement).

---

## Avant de commencer

### De quoi tu as besoin

| Élément | Détail |
|---------|--------|
| Compte Google | Gmail perso ou pro (celui que tu garderas pour les paiements AdMob) |
| Carte / coordonnées | Plus tard pour recevoir l’argent (tu peux commencer sans avoir encaissé) |
| Package Android de l’app | **`com.steve.homeshared`** (déjà configuré dans le code — à donner si AdMob le demande) |

### Ce que tu vas obtenir à la fin

Deux lignes à copier dans `homeshared/apps/mobile/.env` :

```env
EXPO_PUBLIC_ADMOB_ANDROID_APP_ID="ca-app-pub-XXXXXXXX~YYYYYYYYYY"
EXPO_PUBLIC_ADMOB_BANNER_ID="ca-app-pub-XXXXXXXX/ZZZZZZZZZZ"
```

Sans ces 2 IDs, l’app ne peut pas afficher **tes** vraies pubs (seulement les pubs de test Google).

---

## Étape 1 — Ouvrir AdMob

1. Navigateur → **https://admob.google.com/**
2. Clique **Commencer** ou **Se connecter** avec ton compte Google.
3. Si Google demande de choisir un compte : prends celui que tu utiliseras pour **tous** les services Google de homeshared (AdMob + Play Console plus tard = même compte recommandé).

---

## Étape 2 — Créer ton compte AdMob (première visite)

L’écran exact change parfois ; en général tu vois un **assistant de configuration**.

### 2.1 Pays / fuseau

- Choisis **France** (ou ton pays de résidence fiscale).
- Fuseau horaire : Paris si proposé.

### 2.2 Conditions

- Lis et **accepte** les conditions AdMob / Google.

### 2.3 Compte de paiement (AdSense)

AdMob paie via **Google AdSense**. Google peut te demander :

- Nom, adresse
- Comment tu veux être payé (virement bancaire en Europe, souvent)

**Tu n’as pas besoin d’argent sur le compte** pour créer des unités pub. Tu dois en revanche **terminer** cette étape pour que le compte soit « actif ».

> Si Google dit « en cours de validation » : tu peux quand même créer l’app et la bannière ; les pubs peuvent mettre **quelques heures** à s’afficher sur téléphone.

### 2.4 Questionnaire (parfois)

Google peut demander :

- Type de contenu de l’app (famille / maison / utilitaire → réponds honnêtement)
- Si tu es développeur ou agence → **développeur indépendant** / particulier

Valide jusqu’à arriver sur le **tableau de bord AdMob** (menu à gauche : Accueil, Apps, Rapports…).

**✅ Checkpoint** : tu vois le tableau de bord AdMob, pas seulement un écran « terminez votre inscription ».

---

## Étape 3 — Ajouter l’application Android

1. Menu gauche → **Apps** (Applications).
2. Bouton **Ajouter une application** (ou **+ Ajouter**).

### Questions de l’assistant

| Question | Réponse pour homeshared |
|----------|-------------------------|
| L’app est-elle sur un store ? | **Non** — pas encore sur le Play Store |
| Plateforme | **Android** |
| Nom de l’app | `homeshared` (ou « Homeshared ») |
| Nom du package Android | **`com.steve.homeshared`** si le champ existe |

3. Valide / **Ajouter**.

**✅ Checkpoint** : ton app apparaît dans la liste **Apps** avec une icône Android.

---

## Étape 4 — Récupérer l’ID d’application (App ID)

1. Clique sur **homeshared** dans la liste des apps.
2. Tu arrives sur la page de détails de l’app.

Cherche une section du type :

- **Paramètres de l’application**, ou
- **ID d’application**, ou
- **App settings**

Tu dois voir une valeur qui ressemble à :

```text
ca-app-pub-1234567890123456~9876543210987654
```

(caractère **`~`** au milieu, pas un `/`)

3. **Copie** cette valeur dans un bloc-notes temporaire, label : `APP_ID`.

**✅ Checkpoint** : tu as une chaîne `ca-app-pub-…~…`

---

## Étape 5 — Créer l’unité publicitaire « Bannière »

C’est l’emplacement où la pub s’affichera en bas de l’écran d’accueil dans homeshared.

1. Toujours sur la fiche de l’app **homeshared**.
2. Onglet ou section **Unités publicitaires** (Ad units).
3. **Ajouter une unité** / **Créer une unité**.

| Champ | Valeur |
|-------|--------|
| Format | **Bannière** (Banner) — pas Interstitiel, pas Récompensée pour l’instant |
| Nom de l’unité | `Accueil banniere` (ou `home_banner`) |

4. **Créer**.

5. AdMob affiche l’**ID de l’unité** (Unit ID), format :

```text
ca-app-pub-1234567890123456/1122334455667788
```

(caractère **`/`** entre les deux blocs de chiffres)

6. **Copie** dans le bloc-notes, label : `BANNER_ID`.

**✅ Checkpoint** : tu as une chaîne `ca-app-pub-…/…`

---

## Étape 6 — Vérifier que tu as bien 2 IDs différents

| Nom | Variable dans le projet | Forme |
|-----|------------------------|--------|
| ID application | `EXPO_PUBLIC_ADMOB_ANDROID_APP_ID` | contient **`~`** |
| ID bannière | `EXPO_PUBLIC_ADMOB_BANNER_ID` | contient **`/`** |

Les deux commencent par `ca-app-pub-` mais **ne sont pas identiques**.

---

## Étape 7 — Coller les IDs dans le projet

1. Ouvre le fichier (dans Cursor ou Notepad) :

   `c:\Users\steve\Desktop\WeeklyDev\homeshared\apps\mobile\.env`

2. Remplace **uniquement** les lignes AdMob (garde Supabase et API tels quels) :

```env
EXPO_PUBLIC_ADMOB_ANDROID_APP_ID="COLLE_TON_APP_ID_ICI"
EXPO_PUBLIC_ADMOB_BANNER_ID="COLLE_TON_BANNER_ID_ICI"
EXPO_PUBLIC_ADS_CONSENT="true"
EXPO_PUBLIC_ADS_USE_REAL_UNITS="true"
```

3. **Enregistre** le fichier.

4. Ne commit **jamais** ce fichier (il est déjà dans `.gitignore`).

**✅ Checkpoint** : ton `.env` mobile contient tes vrais `ca-app-pub-…` (plus les IDs `3940256099942544` de test, sauf si tu les gardes volontairement pour comparer).

---

## Étape 8 — (Recommandé) Appareil de test

Pour éviter de cliquer sur tes propres pubs en test (risque de suspension AdMob) :

1. AdMob → icône **engrenage** → **Paramètres**.
2. Onglet **Appareils de test** (Test devices).
3. Plus tard, quand tu auras un APK sur téléphone, tu pourras ajouter l’ID d’appareil publicitaire (Google explique la procédure sur cette page).

Tu peux **sauter** cette étape pour l’instant.

---

## Règles importantes (à lire une fois)

1. **Ne clique pas** sur les pubs de ton app toi-même en boucle (Google considère ça de la fraude).
2. **Ne demande pas** à ta famille de cliquer « pour aider ».
3. Les **revenus** arrivent seulement quand l’app est installée par de vrais utilisateurs ; le seuil de paiement est d’environ **70 €** cumulés (variable selon pays).
4. Sur **localhost web**, tu ne verras **pas** ces pubs — c’est normal ; AdMob mobile = téléphone avec APK (étape suivante, plus tard).

---

## Dépannage AdMob

| Problème | Solution |
|----------|----------|
| « Compte pas encore approuvé » | Attendre 24–48 h, vérifier email Google / AdSense |
| Je ne trouve pas l’ID d’application | Apps → cliquer homeshared → Paramètres / App settings |
| Je ne vois pas « Bannière » | Choisir **Banner**, pas « Native » ni « Interstitial » |
| Un seul ID copié | Il en faut **deux** : App ID (`~`) + unité bannière (`/`) |
| Interface en anglais | Même menus : **Apps**, **Ad units**, **Banner**, **Add app** |

---

## Quand tu as fini

Coche mentalement :

- [ ] Compte AdMob créé (tableau de bord visible)
- [ ] App Android **homeshared** ajoutée
- [ ] Unité **Bannière** créée
- [ ] 2 IDs copiés dans `apps/mobile/.env`
- [ ] Fichier enregistré

Ensuite, dis-moi dans le chat : **« AdMob OK »** (tu peux coller les 2 IDs — ce ne sont pas des mots de passe) et on enchaînera sur **Expo / build APK** pour voir la bannière sur ton téléphone.

---

## Liens utiles

- AdMob : https://admob.google.com/
- Aide Google (ajouter une app) : https://support.google.com/admob/answer/9989980
- Résumé technique homeshared : [ADS.md](./ADS.md)
