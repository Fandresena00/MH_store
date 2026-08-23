# M&H Store — Frontend Next.js

Le frontend consomme exclusivement l'API Symfony. Les données métier ne sont
pas stockées dans le frontend : produits, catégories, articles et commandes
proviennent de la base du backend.

## Démarrage

```bash
pnpm install
pnpm dev
```

Variables `.env.local` :

```dotenv
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
NEXT_PUBLIC_ADMIN_URL=http://127.0.0.1:8000/admin/connexion
```

## Authentification

1. `POST /api/auth/register` crée le compte et envoie un email de vérification.
2. Le lien ouvre `/verification-email?token=...`.
3. Après vérification, la connexion sur `/connexion` reçoit le JWT.
4. Le JWT est conservé côté navigateur et envoyé automatiquement à l'API pour
   `/api/me` et `/api/account/orders`.

En cas de panne backend, le frontend n'affiche aucune donnée de démonstration.

## Vérification

```bash
pnpm exec tsc --noEmit
```

Le compte administrateur et l'injection de données sont documentés dans
[le README backend](../backend/README.md).
