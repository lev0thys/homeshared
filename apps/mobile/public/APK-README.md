# Fichier APK pour téléchargement web

Place ici le build Android signé :

```
download.apk
```

## Obtenir l’APK

```powershell
cd homeshared\apps\mobile
eas build --profile preview --platform android
```

Quand le build est terminé, télécharge l’APK depuis expo.dev puis :

```powershell
cd homeshared
.\scripts\copy-apk.ps1 -SourcePath "C:\Users\steve\Downloads\homeshared.apk"
```

Redéploie Vercel — l’URL publique sera :

`https://ton-site.vercel.app/download.apk`

La page `/download` propose déjà ce lien automatiquement.

> **iOS** : pas d’APK possible. La page `/download` guide vers l’installation PWA (Safari → Sur l’écran d’accueil).
