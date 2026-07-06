# Publication Play Store — production directe

Package : `com.steve.homeshared`  
AAB : https://expo.dev/artifacts/eas/9ZMbV5JCeyzfCM8KXaeP7WGkKt-6ut_A2xcWYSi0Bpg.aab

---

## Fichiers prêts (`play-store/`)

| Fichier | Usage Play Console |
|---------|-------------------|
| `icon-512.png` | Icône application (512×512) |
| `feature-graphic.png` | Bannière présentation (1024×500) |
| `screenshots/01-mes-espaces.png` | Capture 1 |
| `screenshots/02-courses.png` | Capture 2 |
| `screenshots/03-repas.png` | Capture 3 |
| `screenshots/04-frigo.png` | Capture 4 |
| `descriptions/fr.txt` | Textes FR à copier-coller |
| `release-notes/fr.txt` | Notes de version FR |

> Les captures sont des visuels marketing cohérents avec l’app. Tu pourras les remplacer plus tard par de vraies captures de ton téléphone.

---

## ÉTAPE 1 — Contenu de l’application (obligatoire)

Menu **Contenu de l’application** / **App content** — complète **toutes** les tâches :

1. **Politique de confidentialité** → `https://homeshared.vercel.app/privacy`
2. **Publicités** → Oui, contient des annonces
3. **Classification du contenu** → questionnaire (Style de vie, pas de violence, etc.)
4. **Public cible** → 18+ ou selon questionnaire
5. **Sécurité des données** → formulaire (email, données de compte…)

---

## ÉTAPE 2 — Fiche Play Store

Menu **Présentation sur le Play Store** → **Fiche Play Store principale**

| Champ | Copier depuis |
|-------|---------------|
| Titre | `descriptions/fr.txt` → TITRE |
| Description courte | `descriptions/fr.txt` → DESCRIPTION COURTE |
| Description complète | `descriptions/fr.txt` → DESCRIPTION COMPLÈTE |
| Icône | `icon-512.png` |
| Feature graphic | `feature-graphic.png` |
| Captures téléphone | `screenshots/*.png` | Capture 1–4 (**vraie app** — voir `CAPTURES-ECRAN.md`) |

Langue **Anglais (États-Unis)** : dupliquer avec `descriptions/en.txt`.

---

## ÉTAPE 3 — Production (release)

1. Menu **Production** (ou **Release** → **Production**)
2. **Créer une version**
3. Upload le **.aab** (lien ci-dessus)
4. **Notes de version** : copier `release-notes/fr.txt`
5. **Examiner** → **Déployer en production**

⚠️ Google peut mettre **24–72 h** pour la première review production.

---

## ÉTAPE 4 — Après publication

1. AdMob → lier l’app à Google Play
2. Vercel → `EXPO_PUBLIC_PLAY_STORE_URL` = URL Play de l’app
3. Tag v1 quand tu es satisfait (validation Steve)

---

## Regénérer les assets

```powershell
cd homeshared
node play-store/scripts/generate-play-assets.mjs
```
