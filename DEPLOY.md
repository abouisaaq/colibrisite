# Déploiement — Vercel + Convex

Stack cible : **Next.js sur Vercel** + **Convex** (base de données, fichiers, CMS).

> Ancien guide Hostinger/MySQL/Prisma : archivé conceptuellement. Ne plus l’utiliser pour une nouvelle prod.

## Prérequis

- Compte [Vercel](https://vercel.com)
- Compte [Convex](https://dashboard.convex.dev)
- Compte PayPal Developer (sandbox puis live)

## 1. Convex (dev)

```bash
npx convex login
npx convex dev
```

Cela crée `NEXT_PUBLIC_CONVEX_URL` dans `.env.local` et pousse le schéma.

Définir le secret de pont (obligatoire) :

```bash
# générer un secret fort, puis :
npx convex env set CONVEX_BRIDGE_SECRET "votre-secret-long"
```

Dans `.env.local` :

```
NEXT_PUBLIC_CONVEX_URL=https://xxxxx.convex.cloud
CONVEX_BRIDGE_SECRET=votre-secret-long
AUTH_SECRET=...
AUTH_URL=http://localhost:4000
NEXT_PUBLIC_APP_URL=http://localhost:4000
PAYPAL_MODE=sandbox
PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_SECRET=...
NEXT_PUBLIC_PAYPAL_CLIENT_ID=...
PAYPAL_WEBHOOK_ID=
```

Seed admin :

```bash
npx tsx scripts/seed-convex.ts
```

Compte par défaut : `admin@colibris.org` / `admin123` — **à changer immédiatement**.

## 2. Variables Vercel (production)

| Variable | Où | Description |
|----------|-----|-------------|
| `NEXT_PUBLIC_CONVEX_URL` | Vercel | URL Convex **production** |
| `CONVEX_BRIDGE_SECRET` | Vercel **et** Convex prod | Même valeur des deux côtés |
| `CONVEX_DEPLOY_KEY` | Vercel | Deploy key Convex |
| `AUTH_SECRET` | Vercel | Secret Auth.js |
| `AUTH_URL` | Vercel | `https://votre-domaine` |
| `NEXT_PUBLIC_APP_URL` | Vercel | Même URL publique |
| `PAYPAL_MODE` | Vercel | `live` |
| `PAYPAL_CLIENT_ID` / `SECRET` | Vercel (ou CMS Paramètres) | Identifiants live |
| `PAYPAL_WEBHOOK_ID` | Vercel (ou CMS) | ID webhook PayPal |

Sur Convex production :

```bash
npx convex env set CONVEX_BRIDGE_SECRET "même-secret" --prod
```

## 3. Déployer sur Vercel

1. Pousser le repo sur GitHub
2. Importer le projet sur Vercel
3. Ajouter les variables d’environnement
4. Build (déjà dans `vercel.json`) :

```
npx convex deploy --cmd 'npm run build'
```

5. Deploy

## 4. Architecture

```
Navigateur → Vercel (Next.js)
                ↓
         Convex (DB + storage + CMS)
                ↓
         PayPal webhooks → /api/webhooks/paypal → Convex
```

- **Auth admin** : NextAuth + table `users` Convex (`ADMIN` / `EDITOR`)
- **Fichiers** : Convex File Storage
- **Analytics / health** : Convex `siteVisits`
- **Settings / contenu** : tables Convex

## 5. PayPal (prod)

1. Application **Live** dans le dashboard PayPal
2. Webhook URL : `https://votre-domaine.com/api/webhooks/paypal`
3. Événement : `PAYMENT.CAPTURE.COMPLETED`
4. Copier le Webhook ID dans env ou Admin → Paramètres
5. Laisser vide le champ Webhook/Secret dans le formulaire pour **ne pas écraser** une valeur déjà enregistrée

## 6. Commandes utiles

```bash
npx convex dev          # terminal 1 — sync fonctions
npm run dev             # terminal 2 — Next
npx convex deploy       # pousser Convex en prod (via CI Vercel de préférence)
npx tsx scripts/seed-convex.ts
```

## 7. Checklist go-live

- [ ] Mot de passe admin changé
- [ ] `CONVEX_BRIDGE_SECRET` identique Vercel ↔ Convex
- [ ] PayPal live + webhook configurés
- [ ] `/api/health` → `{ status: "ok", database: "convex" }`
- [ ] Test don sandbox puis live
