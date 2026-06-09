# @tech-bricks/ads (vendu dans homeshared)

Copie de `WeeklyDev/tech-bricks/react-native/ads` pour que **EAS Build** et **Vercel** puissent résoudre la dépendance workspace (la brique externe n'est pas dans le repo GitHub).

Lors d'une mise à jour de la brique upstream, resynchroniser :

```powershell
Copy-Item -Recurse -Force `
  "..\..\tech-bricks\react-native\ads\src" `
  ".\packages\tech-bricks-ads\src"
Copy-Item -Force `
  "..\..\tech-bricks\react-native\ads\package.json" `
  ".\packages\tech-bricks-ads\package.json"
```

Source canonique : `tech-bricks/react-native/ads/`.
