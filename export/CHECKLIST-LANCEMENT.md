# Checklist lancement — homeshared

**État code** : prêt pour déploiement (v1 fonctionnelle côté dev).
**Dernière vérif auto** : `pnpm verify` (typecheck + 49 tests API). Smoke E2E API : `pnpm verify:full` avec `pnpm dev:api` lancé.

---

## 🔴 Bloquant avant mise en ligne

### Supabase & API
- [ ] `.env` racine : `DATABASE_URL` (pooler) + `DIRECT_DATABASE_URL` — `docs/SETUP-STEVE.md`
- [ ] `pnpm prisma:db-push` + `pnpm prisma:seed` sans erreur
- [ ] API prod déployée (Fly.io) : `fly deploy` — `docs/DEPLOYMENT.md` étape 1
- [ ] `curl https://TON-API.fly.dev/health/db` → OK

### Supabase dashboard
- [ ] Realtime activé sur 5 tables — `docs/REALTIME-SETUP.md`
- [ ] Redirect URLs OAuth : localhost + domaine Vercel prod — `docs/AUTH-GOOGLE.md`
- [ ] Google provider activé (si OAuth souhaité)

### Site web (Vercel)
- [ ] Repo importé, root `apps/mobile`
- [ ] Variables `EXPO_PUBLIC_API_URL`, `SUPABASE_*`, `EXPO_PUBLIC_SITE_URL`
- [ ] `/privacy` accessible publiquement
- [ ] `/download` avec APK (après build EAS)

### Android
- [ ] Compte Google Play Developer (~25 USD)
- [ ] Compte Expo + `eas login` + `eas init`
- [ ] Secrets EAS (API, Supabase, AdMob)
- [ ] `eas build --profile production` → AAB
- [ ] Upload Play Console → **tests internes**
- [ ] Politique confidentialité URL dans Play Console
- [ ] Déclaration « contient des annonces »

### AdMob
- [ ] App + unité bannière créées — `docs/PUBLICATION-ANDROID-ADS.md`
- [ ] IDs dans secrets EAS / `.env`

---

## 🟡 Recommandé avant tag v1.0.0

- [ ] Parcours E2E 2 comptes coché — `docs/E2E-CHECKLIST.md`
- [ ] APK preview testé sur téléphone réel
- [ ] PWA iOS testée (Safari → Sur l’écran d’accueil)
- [ ] Captures d’écran Play Store (min. 2) → `export/play-store/screenshots/`
- [ ] Feature graphic 1024×500 → `export/play-store/feature-graphic.png`
- [ ] Remplacer `VOTRE-DOMAINE` dans descriptions Play

---

## 🟢 Déjà fait (code)

- [x] App mobile + API + recettes + planning + tâches
- [x] Sync Realtime (code + doc)
- [x] RGPD : privacy, suppression compte, UMP ads
- [x] Page `/download` (APK Android + guide iOS PWA)
- [x] Logo transparent bleu (maison + maillon lien)
- [x] Config Fly / Vercel / EAS / Docker
- [x] Descriptions Play FR/EN (brouillon)

---

## Ordre conseillé (1 session)

1. Supabase `.env` + db-push + seed  
2. `fly deploy` API  
3. Vercel web  
4. `eas build` preview → APK → `copy-apk.ps1` → redeploy Vercel  
5. `eas build` production → Play tests internes  
6. E2E checklist  
7. Validation Steve → tag **v1.0.0** sur `main`

---

## Contacts / URLs à noter ici

| Item | Valeur |
|------|--------|
| URL site | *(Vercel — en attente login Steve)* |
| URL API | **https://homeshared-api.fly.dev** |
| URL privacy | *(après Vercel)* `/privacy` |
| URL Play Store | |
| Package Android | `com.steve.homeshared` |
