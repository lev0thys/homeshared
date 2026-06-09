# @tech-bricks/ads

Brique réutilisable pour intégrer AdMob (bannières + interstitiels + rewarded) dans une app Expo / React Native.

## Fournit

- `<AdBanner placement="..." />` : composant bannière (bas de page, header, etc.)
- `showInterstitial(placement)` : pub plein écran entre deux actions
- `showRewardedAd(placement)` : pub récompensée, renvoie le reward obtenu
- `initAds(config)` : initialisation centralisée (test/prod IDs, RGPD consent)

## Statut

- **Version actuelle** : 0.1.0 (interfaces gelées + hook React, implémentation AdMob native à brancher au 1er besoin réel)
- L'implémentation utilise par défaut des IDs de test Google pour permettre le dev sans compte AdMob.
- L'intégration de `react-native-google-mobile-ads` se fait au moment où le projet consommateur en a besoin (config plugin Expo, build EAS).

## Roadmap

- v0.2 : implémentation AdMob branchée + UMP (consentement RGPD)
- v0.3 : équivalent web via AdSense (brique sœur `@tech-bricks/ads-web`)
- v0.4 : analytics impressions / clics

## Projets consommateurs

- `homeshared` (en attente, intégration au 1er release candidate)
