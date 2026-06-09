# Guide pas à pas — Steve

Actions **uniquement toi** peux faire (secrets, Supabase dashboard). Le reste est déjà codé côté agent.

---

## Étape 1 — Corriger la connexion Supabase (5 min) ⭐ IMPORTANT

Évite l’erreur `ConnectionReset / 10054` qui coupe l’API.

### Où trouver les URLs (nouvelle UI Supabase)

Le panneau **Connect** montre souvent **uniquement** l’étape « Connection string » = connexion **Directe** (IPv6).  
Message normal : *« Not IPv4 compatible — Use Session Pooler »*.

**Tu n’as pas besoin de chercher plus loin** : construis les URLs ci-dessous avec ton mot de passe.

| Variable | Mode Supabase | Host | Port | User |
|----------|---------------|------|------|------|
| `DATABASE_URL` | **Transaction pooler** (recommandé API / Prisma) | `aws-1-eu-central-1.pooler.supabase.com` | **6543** | `postgres.ygjgwyvokflwlnlhrolw` |
| `DATABASE_URL` (alt.) | Session pooler | même host | **5432** | `postgres.ygjgwyvokflwlnlhrolw` — max ~15 connexions |
| `DIRECT_DATABASE_URL` | **Direct** (migrations Prisma) | `db.ygjgwyvokflwlnlhrolw.supabase.co` | **5432** | `postgres` |

**Liens directs** (panneau Connect avec le bon mode) :
- [Session pooler](https://supabase.com/dashboard/project/ygjgwyvokflwlnlhrolw?showConnect=true&method=session)
- [Transaction pooler](https://supabase.com/dashboard/project/ygjgwyvokflwlnlhrolw?showConnect=true&method=transaction) — optionnel (serverless)
- [Direct](https://supabase.com/dashboard/project/ygjgwyvokflwlnlhrolw?showConnect=true&method=direct)

**Mot de passe oublié ?** Settings → **Infrastructure** → reset database password.

5. Édite `homeshared/.env` (pas commité) — **exemple homeshared** :

```env
# API (Windows / IPv4) — Transaction pooler RECOMMANDÉ (port 6543)
DATABASE_URL="postgresql://postgres.ygjgwyvokflwlnlhrolw:TON_MDP@aws-1-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1&schema=public"

# Migrations Prisma — Direct (celle affichée dans Connect étape 1)
DIRECT_DATABASE_URL="postgresql://postgres:TON_MDP@db.ygjgwyvokflwlnlhrolw.supabase.co:5432/postgres?schema=public"
```

> L’API ajoute automatiquement `connection_limit=1` si tu utilises le pooler Supabase sans ce paramètre (évite l’erreur **max clients reached / pool_size: 15**).

**Attention guillemets** : une seule paire `"..."` autour de l’URL.  
❌ `DIRECT_DATABASE_URL=""postgresql://...""` → erreur Prisma **P1013** (*illegal characters*)  
✅ `DIRECT_DATABASE_URL="postgresql://..."`

4. Encode les caractères spéciaux du mot de passe (`*` → `%2A`, `,` → `%2C`, etc.)

5. Vérifie :

```powershell
cd homeshared
pnpm prisma:db-push
pnpm prisma:seed
pnpm dev:api
# Autre terminal :
curl http://localhost:3001/health/db
# → {"status":"ok","db":"reachable"}
```

> Utilise **`pnpm prisma:db-push`** (racine), pas `pnpm --filter @homeshared/api exec prisma db push` (erreur « prisma not found »).

---

## Étape 2 — Relancer l’app (2 min)

```powershell
# Terminal 1
pnpm dev:api

# Terminal 2
pnpm --filter @homeshared/mobile start:clear
```

Ouvre **http://localhost:8081** → connecte-toi.

### Connexion Google (une fois)

Si **Continuer avec Google** échoue, configure Supabase + Google Cloud : voir **[docs/AUTH-GOOGLE.md](./AUTH-GOOGLE.md)** (redirect URLs + provider activé).

### Vraies pubs AdMob + APK (publication)

Pas sur le web ni Expo Go : guide **[docs/PUBLICATION-ANDROID-ADS.md](./PUBLICATION-ANDROID-ADS.md)** (AdMob → `.env` → `eas build` → téléphone).

### Mise en ligne (site + Play Store)

Guide complet **[docs/DEPLOYMENT.md](./DEPLOYMENT.md)** — API Fly.io, site Vercel, AAB Play Store.

---

## Étape 3 — Test rapide (3 min)

```powershell
pnpm test:features
```

Attendu : **12/12 OK**.

Parcours manuel :
- [ ] Courses → cercle à gauche pour cocher
- [ ] Jardin → changer de mois (doit être **instantané** après 1er chargement)
- [ ] Hub → carte « De saison »

---

## Étape 4 — Si l’API coupe encore

1. Relance `pnpm dev:api` (une ligne suffit)
2. Vérifie que `DATABASE_URL` utilise bien le **pooler 6543**, pas le 5432 seul
3. Envoie les dernières lignes du terminal si `prisma:error` revient

---

## Optionnel — Logs SQL verbeux

Uniquement pour debug :

```env
PRISMA_LOG_QUERIES=1
```

Sinon les `prisma:query` n’apparaissent plus (normal).

---

## Ce que l’agent a déjà optimisé (rien à faire)

- Cache auth 5 min → plus de 4–5 requêtes SQL par clic mois jardin/saison
- Reconnexion Prisma auto si connexion coupée
- Logs Prisma allégés
- Cache mobile 24h sur catalogues statiques
- Health check `/health/db`
