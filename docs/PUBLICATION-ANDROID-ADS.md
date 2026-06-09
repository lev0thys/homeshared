# Guide pas à pas — Vraies pubs AdMob + publication Android

**Temps estimé** : 1–2 h la première fois (comptes + premier build EAS).

**Important** : les pubs **ne s’affichent pas** sur `localhost:8081` (web) ni dans **Expo Go**. Il faut un **APK installé** sur un téléphone Android (build EAS).

---

## Vue d’ensemble

| Étape | Quoi | Où |
|-------|------|-----|
| A | Compte AdMob + créer l’app + unité bannière | [admob.google.com](https://admob.google.com/) |
| B | Coller les IDs dans `.env` | `apps/mobile/.env` |
| C | Compte Expo + EAS | [expo.dev](https://expo.dev/) |
| D | Build APK « preview » | terminal |
| E | Installer l’APK + vérifier la bannière | téléphone |
| F | Play Console + publication | [play.google.com/console](https://play.google.com/console/) |

---

## Étape A — AdMob (15–30 min)

### A1. Compte Google AdMob

1. Va sur **https://admob.google.com/**
2. Connecte-toi avec ton compte Google.
3. Accepte les conditions si c’est la première fois.

### A2. Créer l’application Android dans AdMob

1. Menu **Apps** → **Ajouter une application**.
2. **L’application est-elle déjà publiée ?** → **Non** (pour l’instant).
3. **Plateforme** : Android.
4. **Nom** : `homeshared` (ou le nom affiché sur le Play Store plus tard).
5. Valide.

> Le **package Android** doit correspondre au projet : `com.steve.homeshared` (déjà dans `app.json`).

### A3. Créer une unité publicitaire « Bannière »

1. Ouvre ton app dans AdMob → **Unités publicitaires** → **Ajouter une unité**.
2. Type : **Bannière**.
3. Nom : par ex. `Accueil bannière`.
4. Copie l’**ID de l’unité** (format `ca-app-pub-XXXXXXXX/YYYYYYYYYY`).

### A4. Noter l’ID d’application AdMob

Sur la fiche de l’app AdMob, note aussi l’**ID d’application** (format `ca-app-pub-XXXXXXXX~ZZZZZZZZZZ`).

Tu dois avoir **2 valeurs** :

```
App ID     : ca-app-pub-....~.....
Bannière   : ca-app-pub-....../.....
```

### A5. (Recommandé) Appareil de test

Pour tester les **vraies** unités sans risquer d’invalid traffic en cliquant partout :

1. AdMob → **Paramètres** (engrenage) → **Appareils de test**.
2. Ajoute l’**ID publicitaire** de ton téléphone (AdMob explique comment l’obtenir depuis Logcat ou l’app en dev).

---

## Étape B — Mettre les IDs dans le projet (5 min)

Édite **`homeshared/apps/mobile/.env`** (fichier local, jamais commité) :

```env
# Remplace par TES vrais IDs AdMob (étape A)
EXPO_PUBLIC_ADMOB_ANDROID_APP_ID="ca-app-pub-TON_APP_ID~XXXXXXXX"
EXPO_PUBLIC_ADMOB_BANNER_ID="ca-app-pub-TON_APP_ID/YYYYYYYYYY"

EXPO_PUBLIC_ADS_CONSENT="true"
# Pour un build EAS preview/prod avec vraies unités :
EXPO_PUBLIC_ADS_USE_REAL_UNITS="true"
```

Garde aussi Supabase / API comme avant (`EXPO_PUBLIC_SUPABASE_*`, `EXPO_PUBLIC_API_URL`).

**En production**, l’API ne doit pas être `localhost` : utilise l’URL de ton API hébergée (Fly/Railway/Render) dans `EXPO_PUBLIC_API_URL` au moment du build EAS (voir étape D3).

---

## Étape C — Expo + EAS (10–20 min)

### C1. Installer les outils

```powershell
npm install -g eas-cli
```

### C2. Compte Expo

1. **https://expo.dev/signup** si besoin.
2. Dans un terminal :

```powershell
cd c:\Users\steve\Desktop\WeeklyDev\homeshared\apps\mobile
eas login
```

### C3. Lier le projet EAS (une seule fois)

```powershell
eas init
```

Réponds aux questions (créer un projet Expo lié à `homeshared`). Cela ajoute un `projectId` dans `app.json`.

### C4. Installer le dev client (profil development, optionnel)

```powershell
npx expo install expo-dev-client
```

---

## Étape D — Build APK avec vraies pubs (20–40 min)

Le fichier **`apps/mobile/eas.json`** définit déjà :

- **`preview`** : APK interne + `EXPO_PUBLIC_ADS_USE_REAL_UNITS=true` (pour tester les vraies unités).
- **`production`** : AAB pour le Play Store.

### D1. Secrets EAS (recommandé)

Les variables `EXPO_PUBLIC_*` doivent être connues **au moment du build** cloud. Deux options :

**Option 1 — Fichier `.env` local** : EAS peut les lire si tu configures :

```powershell
eas secret:create --scope project --name EXPO_PUBLIC_ADMOB_ANDROID_APP_ID --value "ca-app-pub-..."
eas secret:create --scope project --name EXPO_PUBLIC_ADMOB_BANNER_ID --value "ca-app-pub-.../..."
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value "https://....supabase.co"
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "eyJ..."
eas secret:create --scope project --name EXPO_PUBLIC_API_URL --value "https://ton-api.example.com"
```

**Option 2** : tout est déjà dans `apps/mobile/.env` → au premier build, EAS propose parfois de synchroniser ; sinon utilise les secrets ci-dessus.

### D2. Lancer le build preview (APK)

```powershell
cd c:\Users\steve\Desktop\WeeklyDev\homeshared\apps\mobile
eas build --profile preview --platform android
```

- Première fois : questions sur le **keystore** Android → laisse EAS **générer** et stocker (recommandé).
- Attends la fin sur **expo.dev** → onglet Builds → télécharge l’**APK**.

### D3. API en test sur téléphone

Sur un vrai téléphone, `http://localhost:3001` **ne marche pas**. Avant le build :

- Soit tu déploies l’API (Fly.io, Railway…) et tu mets son URL dans `EXPO_PUBLIC_API_URL`.
- Soit tu testes d’abord **uniquement l’écran de connexion + bannière** (AdMob peut s’afficher même si l’API est hors ligne, tant que Supabase est configuré).

Pour un test rapide **pubs seulement** : build avec Supabase OK ; l’accueil peut charger partiellement.

---

## Étape E — Tester sur ton téléphone (10 min)

1. Sur le téléphone : **Paramètres** → autoriser **Sources inconnues** / installer depuis Chrome.
2. Télécharge et installe l’APK depuis le lien EAS.
3. Ouvre **homeshared** → connecte-toi.
4. Écran **Mes espaces** (accueil) : une **bannière** en bas.

### Si tu ne vois pas de pub

| Symptôme | Action |
|----------|--------|
| Rien en bas | Vérifier `EXPO_PUBLIC_ADS_CONSENT=true` ; rebuild avec `preview`. |
| Texte « Pub indisponible » | IDs AdMob incorrects ou app AdMob pas encore validée (peut prendre quelques heures). |
| Toujours pubs « Test Ad » | IDs encore ceux Google `3940256099942544` ou build sans `EXPO_PUBLIC_ADS_USE_REAL_UNITS=true`. |
| Expo Go | Normal : **il faut l’APK EAS**. |

Logs utiles : brancher le téléphone en USB, `adb logcat | findstr ads` (ou filtre `AdMob`).

---

## Étape F — Préparer le Play Store (plus tard, même fil)

### F1. Compte développeur Google Play

- **https://play.google.com/console** — frais unique **~25 USD**.
- Créer l’application → package `com.steve.homeshared`.

### F2. Lier AdMob ↔ Play Store

Dans AdMob : **Apps** → ton app → **Lier à Google Play** (une fois l’app créée dans la console).

### F3. Build production (AAB)

```powershell
eas build --profile production --platform android
```

Téléverse le **.aab** dans Play Console → **Tests internes** d’abord.

### F4. Obligations avant publication

- [ ] **Politique de confidentialité** (URL publique, FR + EN) — données : email, groupes, Supabase.
- [ ] **Icône** 512×512 + captures d’écran (voir dossier `play-store/` quand prêt).
- [ ] Déclaration **publicités** dans le formulaire Play (« contient des annonces »).
- [ ] **RGPD** : bandeau consentement UMP (backlog v1.1) avant scale EU.

### F5. APK direct (site web)

Tu peux héberger le même APK `preview` ou un build `production` signé sur une page « Télécharger l’app » (hors Play Store).

---

## Checklist rapide « je n’ai rien fait »

```
[ ] Compte AdMob créé
[ ] App Android homeshared dans AdMob
[ ] Unité Bannière créée → 2 IDs copiés
[ ] apps/mobile/.env mis à jour (vrais IDs + ADS_USE_REAL_UNITS)
[ ] eas login + eas init
[ ] eas build --profile preview --platform android
[ ] APK installé sur téléphone → bannière visible sur l’accueil
[ ] (Plus tard) Play Console + eas build production
```

---

## Fichiers du repo

| Fichier | Rôle |
|---------|------|
| `apps/mobile/eas.json` | Profils build preview / production |
| `apps/mobile/.env.example` | Modèle variables AdMob |
| `apps/mobile/src/lib/ads-init.ts` | Test vs vraies unités |
| `docs/ADS.md` | Résumé technique |

Quand tu as tes **2 IDs AdMob** (App ID + Bannière), tu peux les coller ici (sans autres secrets) et on vérifiera ensemble le `.env` avant le premier `eas build`.
