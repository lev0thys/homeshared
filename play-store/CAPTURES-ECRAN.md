# Captures d'écran Play Store — VRAIE application

Google exige des **captures réelles** de ton app (pas des mockups inventés).

Les images générées par IA ont été déplacées dans `mockups-generated/` — **ne pas les uploader**.

---

## Option A — Depuis ton téléphone Android (recommandé, 5 min)

1. Installe l’app (APK ou Play)
2. Connecte-toi, ouvre un groupe avec un peu de contenu (courses, frigo, repas)
3. Sur chaque écran : **Volume bas + Power** = capture
4. Transfère les PNG sur ton PC (USB, Google Photos, etc.)
5. Renomme et place dans `play-store/screenshots/` :
   - `01-mes-espaces.png`
   - `02-courses.png`
   - `03-repas.png`
   - `04-frigo.png`

**Redimensionner (optionnel)** :
```powershell
cd homeshared
node play-store/scripts/generate-play-assets.mjs
```
*(Ne régénère que icon + feature graphic si les sources existent ; les screenshots restent les tiens.)*

---

## Option B — Script automatique (web = même UI)

Compte homeshared avec **au moins 1 groupe** et des données.

```powershell
cd c:\Users\steve\Desktop\WeeklyDev\homeshared
$env:PLAY_STORE_SCREENSHOT_EMAIL="ton@email.com"
$env:PLAY_STORE_SCREENSHOT_PASSWORD="tonmotdepasse"
npx playwright install chromium
node play-store/scripts/capture-play-screenshots.mjs
```

URL par défaut : `https://homeshared.vercel.app`

---

## Option C — Chrome DevTools (PC)

1. Ouvre https://homeshared.vercel.app
2. F12 → icône mobile → **412 × 915**
3. Connecte-toi, navigue, **Capture screenshot** (menu ⋮ du DevTools)

---

## Feature graphic & icône

- **Icône** `icon-512.png` = ton vrai logo (depuis `apps/mobile/assets/icon.png`) ✅
- **Feature graphic** : bannière marketing OK (pas un screenshot obligatoire) — `feature-graphic.png` actuel ou refais une bannière avec le vrai logo

---

## Minimum Play Console

- **2 captures** minimum (idéal : 4)
- Format : PNG ou JPEG, côté long entre 320 px et 3840 px
