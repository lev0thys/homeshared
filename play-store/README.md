# Play Store — assets & déploiement

## Fichiers prêts (2026-07-04)

| Fichier | Format | Statut |
|---------|--------|--------|
| `icon-512.png` | 512×512 | ✅ |
| `feature-graphic.png` | 1024×500 | ✅ |
| `screenshots/` (4 captures) | 1080×1920 | ⚠️ **Vraies captures app** — voir `CAPTURES-ECRAN.md` |
| `descriptions/fr.txt` + `en.txt` | textes fiche | ✅ |
| `release-notes/fr.txt` + `en.txt` | notes version | ✅ |
| `COPY-PASTE-PLAY-CONSOLE.md` | copier-coller rapide | ✅ |
| `PUBLICATION-PRODUCTION.md` | guide production | ✅ |

Regénérer : `node play-store/scripts/generate-play-assets.mjs`

## Soumission automatisée (optionnel)

Quand tu auras un compte de service Google Play :

1. Play Console → **API access** → créer un compte de service JSON.
2. Placer le fichier **hors repo** ou dans un chemin ignoré par git : `play-store/service-account.json` (déjà dans `.gitignore` si tu l’ajoutes).
3. `eas submit --platform android --profile production`

Voir `docs/PUBLICATION-ANDROID-ADS.md` pour le flux complet.
