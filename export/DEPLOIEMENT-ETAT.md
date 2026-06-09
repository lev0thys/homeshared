# État déploiement homeshared — 2026-06-08

## ✅ En ligne

| Service | URL | Statut |
|---------|-----|--------|
| **API** | https://homeshared-api.fly.dev | OK (`/health/db`) |
| **Expo / EAS** | https://expo.dev/accounts/lev0thy/projects/homeshared | Projet lié, keystore OK |
| **Vercel** | https://vercel.com/hevol-it/homeshared | Projet lié, env vars OK |

## 🔧 En cours

- Build EAS APK preview (file d'attente Expo)
- Deploy Vercel web (depuis racine monorepo)

## 📋 À faire — Steve (par priorité)

### 1. Relancer le dev local (2 terminaux)

```powershell
cd c:\Users\steve\Desktop\WeeklyDev\homeshared
pnpm dev:stop
pnpm dev:api
# Terminal 2 :
pnpm --filter @homeshared/mobile start:clear
```

### 2. Supabase — redirects prod (5 min)

Dashboard → Authentication → URL Configuration :

- **Site URL** : URL Vercel prod (ex. `https://homeshared.vercel.app`)
- **Redirect URLs** : ajouter `https://homeshared.vercel.app/**`

### 3. APK Android

Quand le build EAS est vert sur expo.dev :

1. Télécharger l'APK
2. `.\scripts\copy-apk.ps1 -SourcePath "C:\chemin\build.apk"`
3. Redéployer Vercel (pour `/download.apk`)

**Plan B** : build local Android Studio (`npx expo prebuild` puis Gradle).

### 4. Google Play (après APK OK)

- Compte Play Developer (25 $)
- `eas build --profile production --platform android`
- Upload AAB → Tests internes
- Privacy URL : `https://TON-SITE.vercel.app/privacy`
- Captures + feature graphic 1024×500

## 💰 Coûts — pas besoin du Vercel Pro

| Service | Plan | Suffisant v1 ? |
|---------|------|----------------|
| Vercel | **Hobby (gratuit)** | Oui |
| Fly.io | Pay-as-you-go (~0–5 €/mois) | Oui (carte déjà ajoutée) |
| Supabase | Free | Oui |
| EAS | Free tier builds | Oui |
| Play Store | 25 $ une fois | Requis |

## Rappel — à quoi sert quoi

```
Téléphone (APK)     → EAS / Play Store / Android Studio
Site web + iOS PWA  → Vercel (gratuit)
API backend         → Fly.io
Auth + DB           → Supabase
```

L'APK **ne passe pas** par Vercel. Vercel sert le site, la page `/download`, `/privacy` et l'install iPhone (PWA).
