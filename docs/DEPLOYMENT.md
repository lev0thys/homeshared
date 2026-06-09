# Mise en ligne — site web + Play Store

Guide complet pour publier **homeshared** sur Internet (PWA) et le **Google Play Store**.

**Temps estimé** : 2–4 h la première fois (comptes + déploiements).

---

## Architecture cible

```
Utilisateur
    ├── Web/PWA ──► Vercel (apps/mobile/dist)
    │                  └── EXPO_PUBLIC_API_URL ──► Fly.io (API)
    └── Android ──► Play Store (AAB EAS)
                         └── même API + Supabase Auth
```

| Composant | Hébergeur | URL exemple |
|-----------|-----------|-------------|
| App web (PWA) | [Vercel](https://vercel.com) | `https://homeshared.vercel.app` |
| API REST | [Fly.io](https://fly.io) | `https://homeshared-api.fly.dev` |
| Auth + DB | Supabase | déjà configuré |
| Android | Google Play | fiche Play Store |

---

## Étape 0 — Prérequis

- [ ] Supabase OK (`docs/SETUP-STEVE.md`) — `pnpm prisma:db-push` + seed
- [ ] Realtime activé (`docs/REALTIME-SETUP.md`)
- [ ] Compte **Google Play Developer** (~25 USD) — [play.google.com/console](https://play.google.com/console)
- [ ] Compte **Expo** — [expo.dev](https://expo.dev)
- [ ] Compte **Vercel** (GitHub connecté)
- [ ] Compte **Fly.io** (carte pour free tier étendu)
- [ ] AdMob configuré (`docs/PUBLICATION-ANDROID-ADS.md`)

---

## Étape 1 — Déployer l’API sur Fly.io (30 min)

### 1.1 Installer Fly CLI

```powershell
powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"
fly auth login
```

### 1.2 Créer l’app (une fois)

```powershell
cd c:\Users\steve\Desktop\WeeklyDev\homeshared
fly apps create homeshared-api
```

> Si le nom est pris, change `app = "..."` dans `fly.toml`.

### 1.3 Secrets (copier depuis ton `.env` local)

```powershell
fly secrets set `
  DATABASE_URL="postgresql://postgres.xxx:MDP@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true" `
  DIRECT_DATABASE_URL="postgresql://postgres:MDP@db.xxx.supabase.co:5432/postgres" `
  JWT_SECRET="ton-secret-32-caracteres-minimum" `
  SUPABASE_URL="https://xxx.supabase.co" `
  SUPABASE_ANON_KEY="eyJ..." `
  SUPABASE_SERVICE_ROLE_KEY="eyJ..." `
  NODE_ENV="production"
```

### 1.4 Déployer

```powershell
fly deploy
fly status
curl https://homeshared-api.fly.dev/health/db
# → {"status":"ok","db":"reachable"}
```

Note l’URL API : **`https://homeshared-api.fly.dev`** (à utiliser partout ci-dessous).

---

## Étape 2 — Déployer le site web sur Vercel (20 min)

### 2.1 Importer le repo

1. [vercel.com/new](https://vercel.com/new) → importer le repo GitHub `homeshared`.
2. **Root Directory** : `apps/mobile`
3. Framework : **Other** (déjà configuré via `vercel.json`)

### 2.2 Variables d’environnement (Build)

| Variable | Valeur |
|----------|--------|
| `EXPO_PUBLIC_API_URL` | `https://homeshared-api.fly.dev` |
| `EXPO_PUBLIC_SUPABASE_URL` | ton URL Supabase |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | clé anon |
| `EXPO_PUBLIC_SITE_URL` | `https://homeshared.vercel.app` (ton domaine Vercel) |
| `EXPO_PUBLIC_PLAY_STORE_URL` | *(vide pour l’instant, remplir après publication)* |
| `EXPO_PUBLIC_APK_URL` | *(optionnel)* `https://homeshared.vercel.app/download.apk` |

### 2.3 Déployer

Clique **Deploy**. URL obtenue : ex. `https://homeshared.vercel.app`.

### 2.4 Supabase — redirects OAuth web

Dashboard Supabase → **Authentication → URL Configuration** :

- **Site URL** : `https://homeshared.vercel.app`
- **Redirect URLs** : ajouter `https://homeshared.vercel.app/**` et `https://homeshared.vercel.app/auth/callback`

(voir aussi `docs/AUTH-GOOGLE.md`)

### 2.5 Pages publiques

| URL | Contenu |
|-----|---------|
| `/` | App (login puis hub) |
| `/privacy` | Politique de confidentialité |
| `/download` | Téléchargement Android + lien web |

### 2.6 PWA iOS (Safari)

Ouvre le site sur iPhone → **Partager → Sur l’écran d’accueil**.

---

## Étape 3 — Build Android Play Store (45 min)

### 3.1 Secrets EAS (cloud build)

```powershell
cd apps\mobile
eas login
eas init

eas secret:create --scope project --name EXPO_PUBLIC_API_URL --value "https://homeshared-api.fly.dev"
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value "https://xxx.supabase.co"
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "eyJ..."
eas secret:create --scope project --name EXPO_PUBLIC_ADMOB_ANDROID_APP_ID --value "ca-app-pub-..."
eas secret:create --scope project --name EXPO_PUBLIC_ADMOB_BANNER_ID --value "ca-app-pub-.../..."
eas secret:create --scope project --name EXPO_PUBLIC_SITE_URL --value "https://homeshared.vercel.app"
```

### 3.2 Build production (AAB)

```powershell
eas build --profile production --platform android
```

Télécharge le **.aab** depuis expo.dev → Builds.

### 3.3 APK téléchargeable depuis le site web

La page **`/download`** propose :
- **Android** : bouton « Télécharger l’APK » → `https://ton-site.vercel.app/download.apk`
- **iPhone/iPad** : guide PWA Safari (pas d’APK possible sur iOS)

```powershell
eas build --profile preview --platform android
# Télécharge l’APK depuis expo.dev, puis :
cd homeshared
.\scripts\copy-apk.ps1 -SourcePath "C:\chemin\vers\build.apk"
git add apps/mobile/public/download.apk   # optionnel si tu ne gitignore pas
# Redéploie Vercel
```

> Par défaut, l’app utilise `/download.apk` sur le même domaine — **pas besoin** de `EXPO_PUBLIC_APK_URL` si le fichier est dans `apps/mobile/public/`.

Un bandeau sur login/signup (mobile web) redirige automatiquement vers `/download`.

---

## Étape 4 — Google Play Console (1 h)

### 4.1 Créer l’application

1. [Play Console](https://play.google.com/console) → **Créer une application**.
2. **Package** : `com.steve.homeshared` (identique à `app.json`).
3. Remplis le questionnaire contenu (publicités = **Oui**).

### 4.2 Fiche Play Store

Textes prêts dans `play-store/descriptions/fr.txt` et `en.txt`.

Assets :

| Fichier | Emplacement |
|---------|-------------|
| Icône 512×512 | `play-store/icon-512.png` ✅ |
| Feature graphic 1024×500 | à créer (`play-store/feature-graphic.png`) |
| Captures d’écran | `play-store/screenshots/` (min. 2) |

**Politique de confidentialité** : `https://homeshared.vercel.app/privacy`

### 4.3 Tests internes

1. Play Console → **Tests internes** → créer une release.
2. Upload le **.aab** EAS production.
3. Ajoute ton email comme testeur.

### 4.4 Soumission automatique (optionnel)

1. Play Console → **API access** → compte de service JSON → sauvegarder dans `play-store/service-account.json` (gitignored).
2. :

```powershell
eas submit --profile production --platform android
```

### 4.5 Après publication

1. Copie l’URL Play Store (`https://play.google.com/store/apps/details?id=com.steve.homeshared`).
2. Mets-la dans Vercel : `EXPO_PUBLIC_PLAY_STORE_URL`.
3. Redéploie Vercel → la page `/download` affichera le bon lien.

---

## Étape 5 — Lier AdMob ↔ Play

AdMob → Apps → homeshared → **Lier à Google Play** (après création fiche Play).

---

## Checklist finale

```
[ ] API Fly.io → /health/db OK
[ ] Site Vercel → login + privacy OK
[ ] Supabase redirects web production OK
[ ] Realtime Supabase activé
[ ] EAS production AAB uploadé Play (tests internes)
[ ] Privacy URL dans Play Console
[ ] EXPO_PUBLIC_PLAY_STORE_URL sur Vercel (après publication)
[ ] Parcours E2E coché (docs/E2E-CHECKLIST.md)
[ ] Tag v1.0.0 sur main (validation Steve)
```

---

## Commandes rapides

```powershell
# API
cd homeshared
fly deploy

# Web (local test export)
pnpm --filter @homeshared/mobile build:web

# Android production
cd apps\mobile
eas build --profile production --platform android
eas submit --profile production --platform android
```

---

## Dépannage

| Problème | Solution |
|----------|----------|
| App web « serveur injoignable » | `EXPO_PUBLIC_API_URL` doit pointer vers Fly, pas localhost |
| OAuth Google échoue en prod | Redirect URLs Supabase + Google Cloud mis à jour |
| Play rejette privacy | URL `/privacy` doit être accessible sans login |
| APK n’installe pas | Autoriser sources inconnues ; vérifier signature EAS |
| API Fly crash au boot | `fly logs` — vérifier secrets DATABASE_URL pooler 6543 |

---

## Fichiers du repo

| Fichier | Rôle |
|---------|------|
| `Dockerfile` + `fly.toml` | API Fly.io |
| `apps/mobile/vercel.json` | Build + rewrites PWA |
| `apps/mobile/public/` | manifest, SW, icônes, APK |
| `apps/mobile/eas.json` | Build preview/production + submit |
| `play-store/` | Descriptions + icône Play |
| `docs/PUBLICATION-ANDROID-ADS.md` | AdMob détaillé |
