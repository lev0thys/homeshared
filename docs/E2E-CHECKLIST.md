# Checklist E2E manuelle — v1 homeshared

Parcours complet à valider avant tag `v1.0.0`. Idéal : **2 comptes** (2 navigateurs ou 1 téléphone + 1 web).

## Prérequis

- [ ] `pnpm dev:api` + mobile (`pnpm --filter @homeshared/mobile start`)
- [ ] `pnpm prisma:db-push` + `pnpm prisma:seed`
- [ ] `.env` API + mobile configurés (`docs/SETUP-STEVE.md`)
- [ ] Realtime activé (`docs/REALTIME-SETUP.md`) pour test multi-user

## 1. Auth

- [ ] Inscription email + mot de passe
- [ ] Connexion / déconnexion
- [ ] (Optionnel) Google OAuth (`docs/AUTH-GOOGLE.md`)
- [ ] Lien politique de confidentialité visible à l’inscription

## 2. Groupes

- [ ] Espace personnel auto-créé à la connexion
- [ ] Création d’un groupe partagé
- [ ] Invitation par lien / token → 2ᵉ membre rejoint
- [ ] Chat groupe : envoi + réception message

## 3. Courses → Frigo

- [ ] Ajout manuel article courses
- [ ] Cocher / valider → article disparaît de la liste
- [ ] Article apparaît dans le frigo (quantité cohérente)
- [ ] **Sync temps réel** : compte B voit l’ajout de A sans refresh

## 4. Recettes

- [ ] Liste recettes avec % match frigo
- [ ] Favori ★
- [ ] Ajout ingrédients manquants → liste courses
- [ ] Planning repas : ajouter recette semaine
- [ ] Bouton « courses manquantes » (semaine + par recette)

## 5. Tâches

- [ ] Créer tâche, claim, marquer done
- [ ] Sync temps réel tâches (optionnel)

## 6. Profil & RGPD

- [ ] Modifier bio / avatar
- [ ] Ouvrir politique de confidentialité (`/privacy`)
- [ ] Supprimer compte test (sans être titulaire d’un groupe multi-membres)
- [ ] (Android build) Bandeau UMP consentement pubs

## 7. Publication (Steve)

- [ ] PWA web déployée (Vercel) — URL privacy : `https://…/privacy`
- [ ] APK signé EAS (`docs/PUBLICATION-ANDROID-ADS.md`)
- [ ] Play Console : privacy policy URL renseignée

## Résultat

| Date | Testeur | Pass | Notes |
|------|---------|------|-------|
|      | Steve   | ☐    |       |
