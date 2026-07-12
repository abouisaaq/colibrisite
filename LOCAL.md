# Développement local — Les Colibris Porteurs d'Espoir

Stack locale : **Next.js + Convex**. Déploiement : [DEPLOY.md](./DEPLOY.md).

## Prérequis

| Outil | Version |
|-------|---------|
| Node.js | 20 LTS |
| npm | 10+ |
| Compte Convex | pour `npx convex dev` |

## Configuration

```bash
cp .env.example .env.local
npm install
```

Variables minimales dans `.env.local` :

```env
NEXT_PUBLIC_CONVEX_URL=https://xxxxx.convex.cloud
CONVEX_BRIDGE_SECRET=secret-partagé-avec-convex
AUTH_SECRET=change-me
AUTH_URL=http://localhost:4000
NEXT_PUBLIC_APP_URL=http://localhost:4000
PAYPAL_MODE=sandbox
PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_SECRET=...
NEXT_PUBLIC_PAYPAL_CLIENT_ID=...
```

Puis :

```bash
npx convex env set CONVEX_BRIDGE_SECRET "même-secret"
```

## Lancer

```bash
# Terminal 1
npx convex dev

# Terminal 2
npx tsx scripts/seed-convex.ts   # une fois
npm run dev                      # http://localhost:4000
```

**Admin** : `admin@colibris.org` / `admin123` — à changer en prod.

## URLs

| Service | URL |
|---------|-----|
| Site | http://localhost:4000 |
| Admin | http://localhost:4000/admin |
| Login | http://localhost:4000/auth/login |
| Health | http://localhost:4000/api/health |

## PayPal local

Les webhooks nécessitent une URL HTTPS publique. En local, la confirmation passe par le bouton PayPal (`onApprove`).

## Notes

- Prisma / SQLite / MySQL ne sont plus requis pour le CMS ni les analytics.
- Les uploads passent par Convex File Storage.
