# Les Colibris Porteurs d'Espoir

Site web de l'association caritative **Les Colibris Porteurs d'Espoir** — Next.js, Convex, CMS admin, dons PayPal.

## Démarrage rapide (local)

```bash
cp .env.example .env.local
# Renseigner NEXT_PUBLIC_CONVEX_URL + CONVEX_BRIDGE_SECRET + AUTH_*

npm install
npx convex dev          # terminal 1
npx tsx scripts/seed-convex.ts
npm run dev             # terminal 2 (port 4000)
```

→ **Guide local** : [LOCAL.md](./LOCAL.md)  
→ **Déploiement prod** : [DEPLOY.md](./DEPLOY.md) (Vercel + Convex)

## URLs locales

| Service | URL |
|---------|-----|
| Site public | http://localhost:4000 |
| Admin CMS | http://localhost:4000/admin |
| Login | http://localhost:4000/auth/login |
| Health | http://localhost:4000/api/health |

**Admin seed** : `admin@colibris.org` / `admin123` — à changer en prod.

## Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS + shadcn/ui
- **Convex** (DB, fichiers, CMS, analytics)
- Auth.js (admin : rôles `ADMIN` / `EDITOR`)
- PayPal Checkout (dons ponctuels)
- Recharts (dashboard admin)

## Scripts

| Commande | Description |
|----------|-------------|
| `npm run dev` | Next.js |
| `npx convex dev` | Sync Convex |
| `npm run build` | Build production |
| `npx tsx scripts/seed-convex.ts` | Seed admin + contenus |
