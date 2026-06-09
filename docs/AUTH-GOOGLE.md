# Connexion / inscription Google (Supabase OAuth)

L’app utilise le flux **PKCE** Supabase. Après Google, le navigateur revient sur `/auth/callback` (web) ou `homeshared://auth/callback` (Android / build natif).

## 1. Supabase Dashboard

Projet → **Authentication** → **Providers** → **Google** :

1. Activer Google.
2. Renseigner **Client ID** et **Client secret** (voir §2).
3. **Authentication** → **URL Configuration** → **Redirect URLs**, ajouter **toutes** les URLs utilisées :

| Contexte | URL à ajouter (exemples) |
|----------|---------------------------|
| Web dev (Expo) | `http://localhost:8081/auth/callback` |
| Expo Go (optionnel) | `exp://127.0.0.1:8081/--/auth/callback` |
| App native (scheme) | `homeshared://auth/callback` |
| Web prod Vercel | `https://homeshared.vercel.app/auth/callback` |
| Web prod (alias) | `https://homeshared-hevol-it.vercel.app/auth/callback` |
| Web prod (deploy preview) | `https://homeshared-*.vercel.app/auth/callback` *(wildcard)* |

> En prod web, l’app utilise `window.location.origin + /auth/callback` — l’URL doit correspondre **exactement** à celle dans Supabase.

**Site URL** (même écran) :
- dev : `http://localhost:8081`
- prod : `https://homeshared.vercel.app`

## 2. Google Cloud Console

1. [Google Cloud Console](https://console.cloud.google.com/) → projet (ou en créer un).
2. **APIs & Services** → **OAuth consent screen** : type External, email support, scopes `email` + `profile`.
3. **Credentials** → **Create credentials** → **OAuth client ID** :
   - Type **Web application** (pour Supabase qui héberge le callback OAuth).
   - **Authorized redirect URIs** : copier l’URL indiquée par Supabase sur la page provider Google, du type :
     `https://ygjgwyvokflwlnlhrolw.supabase.co/auth/v1/callback`
4. Coller **Client ID** + **Client secret** dans Supabase (étape 1).

## 3. Tester en local

```powershell
cd homeshared
pnpm dev:api
pnpm --filter @homeshared/mobile start:clear
```

1. Ouvre **http://localhost:8081**
2. **Connexion** ou **Créer un compte** → **Continuer avec Google**
3. Après consentement → retour sur `/auth/callback` → hub groupes

## Dépannage

| Symptôme | Cause probable |
|----------|----------------|
| « provider is not enabled » | Google pas activé dans Supabase |
| `redirect_uri_mismatch` | Redirect URL manquante dans Supabase **ou** mauvaise URI dans Google Cloud |
| Page blanche après Google | `exchangeCodeForSession` : vérifier `/auth/callback` et `detectSessionInUrl` (web) |
| Expo Go seulement | Préférer **web** (`w`) ou **build dev** ; deep link `homeshared://` nécessite un dev client |

## Code concerné

- `apps/mobile/src/lib/google-auth.ts` — lancement OAuth
- `apps/mobile/app/auth/callback.tsx` — échange du code (web)
- `apps/api/src/plugins/auth.ts` — création user Prisma (nom Google, pseudo depuis email)
