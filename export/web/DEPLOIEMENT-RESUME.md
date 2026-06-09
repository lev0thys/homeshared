# Résumé déploiement web

Voir le guide complet : `docs/DEPLOYMENT.md` (à la racine du repo).

## Vercel

- Root : `apps/mobile`
- Build : `pnpm build:web` (via vercel.json)
- Variables obligatoires :
  - `EXPO_PUBLIC_API_URL`
  - `EXPO_PUBLIC_SUPABASE_URL`
  - `EXPO_PUBLIC_SUPABASE_ANON_KEY`
  - `EXPO_PUBLIC_SITE_URL`

## Pages publiques

- `/` — application
- `/privacy` — politique confidentialité
- `/download` — APK + guide iOS PWA
- `/download.apk` — fichier APK (après `copy-apk.ps1`)

## PWA

- Manifest : `apps/mobile/public/manifest.webmanifest`
- Icônes : `export/logo/icon-192.png`, `icon-512.png`
