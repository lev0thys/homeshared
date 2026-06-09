# Play Store — assets & déploiement

Dossier pour préparer la publication (non bloquant pour tester AdMob en APK).

## À ajouter avant soumission Play Console

| Fichier / contenu | Format |
|-------------------|--------|
| `icon-512.png` | 512×512 |
| `feature-graphic.png` | 1024×500 |
| `screenshots/` | téléphone, min. 2 captures |
| `descriptions/fr.txt` | titre court + description longue |
| `descriptions/en.txt` | idem EN |
| Lien **privacy policy** | URL publique : `/privacy` sur le site PWA déployé (ex. `https://homeshared.vercel.app/privacy`) |

## Soumission automatisée (optionnel)

Quand tu auras un compte de service Google Play :

1. Play Console → **API access** → créer un compte de service JSON.
2. Placer le fichier **hors repo** ou dans un chemin ignoré par git : `play-store/service-account.json` (déjà dans `.gitignore` si tu l’ajoutes).
3. `eas submit --platform android --profile production`

Voir `docs/PUBLICATION-ANDROID-ADS.md` pour le flux complet.
