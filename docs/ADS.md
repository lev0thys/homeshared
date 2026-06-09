# Publicités (AdMob) — homeshared

## Modèle économique

- **AdMob est gratuit** à intégrer : Google affiche des pubs, tu touches une part des revenus (CPM).
- **Tu ne paies rien** tant que tu n’achètes pas de campagnes publicitaires toi-même.
- En **développement** : utilise les **IDs de test Google** (déjà dans `.env`) — pubs factices, **0 € de revenu**.

## Ce qui est en place

| Plateforme | Comportement |
|------------|----------------|
| **Web** (`localhost:8081`) | Bandeau réservé (texte) — AdMob mobile ne tourne pas dans le navigateur |
| **APK / Play Store** | Vraies bannières AdMob via `@tech-bricks/ads` |

Emplacement actuel : **accueil** (bas de l’écran, au-dessus de la zone safe area).

**Prévu plus tard** (backlog, avec amélioration module recettes) : pubs **rewarded opt-in** (fin étapes recette, repas cuisiné) — jamais obligatoires. Voir `BACKLOG.md` → « Pubs opt-in recettes ».

## Variables `.env` (mobile)

```env
# IDs de test Google (OK pour dev — ne génèrent pas de revenus)
EXPO_PUBLIC_ADMOB_ANDROID_APP_ID="ca-app-pub-3940256099942544~3347511713"
EXPO_PUBLIC_ADMOB_BANNER_ID="ca-app-pub-3940256099942544/6300978111"
EXPO_PUBLIC_ADS_CONSENT="true"
```

En **production** : créer une app sur [AdMob](https://admob.google.com/), remplacer par tes vrais IDs, et activer le consentement RGPD (UMP, backlog v1.1).

## Première fois sur AdMob ?

**Guide débutant (uniquement AdMob + `.env`)** : **[ADMOB-PREMIERE-FOIS.md](./ADMOB-PREMIERE-FOIS.md)** ← commence ici.

## Tester sur Android (vraies pubs)

**Suite (APK, Play Store)** : **[PUBLICATION-ANDROID-ADS.md](./PUBLICATION-ANDROID-ADS.md)** — après AdMob.

Résumé :

1. Créer l’app + unité **Bannière** sur [AdMob](https://admob.google.com/).
2. Mettre les vrais IDs dans `apps/mobile/.env` + `EXPO_PUBLIC_ADS_USE_REAL_UNITS=true`.
3. `eas build --profile preview --platform android` (voir `apps/mobile/eas.json`).
4. Installer l’APK sur un téléphone — bannière sur l’écran **Mes espaces**.

Expo Go et le **web** : placeholder uniquement — c’est normal.

## Revenus réels

1. Compte [Google AdMob](https://admob.google.com/) + lier l’app Android `com.steve.homeshared`
2. Créer une unité **Bannière** → copier l’ID dans `EXPO_PUBLIC_ADMOB_BANNER_ID`
3. Publier l’APK / Play Store
4. Seuil de paiement AdMob (~70 € cumulés selon pays)
