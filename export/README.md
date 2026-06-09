# Export publication — homeshared

Dossier **prêt à l’emploi** pour Play Store, site web, réseaux et archives.
Regénère-le après changement de logo : `pnpm export:publication`

## Contenu

```
export/
├── README.md                 ← ce fichier
├── CHECKLIST-LANCEMENT.md    ← ce qu’il reste à faire (Steve)
├── logo/
│   ├── logo-transparent.png  ← logo app (fond transparent, traits bleus)
│   ├── icon-512.png          ← Play Store + PWA 512
│   ├── icon-192.png          ← PWA / favicon
│   └── splash-reference.png  ← même logo (splash = fond #0f172a dans app)
├── play-store/
│   ├── description-fr.txt
│   ├── description-en.txt
│   ├── README-assets.md      ← captures & feature graphic à ajouter
│   └── icon-512.png
├── web/
│   └── DEPLOIEMENT-RESUME.md
├── legal/
│   └── privacy-policy.fr.md
└── docs/
    └── INDEX.md              ← liens vers guides complets du repo
```

## Usage rapide

| Besoin | Fichier |
|--------|---------|
| Logo site / presse | `logo/logo-transparent.png` |
| Play Console icône | `play-store/icon-512.png` |
| Textes fiche Play | `play-store/description-fr.txt` |
| URL privacy (Play) | déployer `/privacy` puis copier l’URL dans Play Console |
| APK sur le site | build EAS → `scripts/copy-apk.ps1` → redeploy Vercel |

## Package ZIP (optionnel)

```powershell
cd homeshared
Compress-Archive -Path export\* -DestinationPath export\homeshared-publication.zip -Force
```
