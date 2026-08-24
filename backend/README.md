# M&H Store — Backend Symfony (API + Admin)

Backend Symfony pur : **API JSON** consommée par un frontend **Next.js**
découplé (déjà livré séparément) + **espace admin** en Twig (**CSS pur**,
sans Tailwind). PostgreSQL + migrations. CORS configuré pour le frontend.

## 1. Dépendances à installer

```bash
# --- Cœur web / Twig (admin uniquement) ---
composer require symfony/twig-bundle symfony/asset-mapper

# --- Doctrine ORM + migrations + fixtures ---
composer require symfony/orm-pack doctrine/doctrine-migrations-bundle
composer require --dev doctrine/doctrine-fixtures-bundle

# --- Pilote PostgreSQL ---
composer require doctrine/dbal
# vérifier que l'extension PHP est active : php -m | grep pdo_pgsql

# --- Sécurité : session (admin) + JWT (API) ---
composer require symfony/security-bundle
composer require lexik/jwt-authentication-bundle

# --- Formulaires + validation (admin + validation des payloads API) ---
composer require symfony/form symfony/validator symfony/property-access

# --- Client HTTP (appels vers l'API PAPI.mg) ---
composer require symfony/http-client

# --- CORS (frontend Next.js en cross-origin sur /api/*) ---
composer require nelmio/cors-bundle
```

**Pas besoin** de `symfonycasts/tailwind-bundle`, `symfony/stimulus-bundle`
ni `symfony/ux-twig-component` — l'admin est en CSS pur servi statiquement
(`public/css/admin.css`), sans étape de build.

## 2. Où placer les fichiers de ce zip

```
src/Entity/            → src/Entity/
src/Repository/        → src/Repository/
src/Controller/Api/    → src/Controller/Api/    (backend pour Next.js)
src/Controller/Admin/  → src/Controller/Admin/  (espace admin Twig)
src/Controller/*.php   → src/Controller/        (SecurityController admin, PapiWebhookController)
src/Form/Admin/        → src/Form/Admin/
src/Security/          → src/Security/
src/Service/           → src/Service/
src/Command/           → src/Command/
src/DataFixtures/      → src/DataFixtures/
templates/              → templates/
public/css/admin.css    → public/css/admin.css
public/images/           → public/images/
migrations/              → migrations/
config/packages/*.yaml  → config/packages/ (fusionner, ne pas écraser un fichier déjà personnalisé sans comparer)
config/services.yaml     → config/services.yaml (À LA RACINE de config/, PAS dans config/packages/ !)
.env                      → fusionner avec ton .env existant
```

⚠️ **Piège classique** : `services.yaml` doit être directement sous
`config/`, jamais dans `config/packages/` — sinon les chemins relatifs
(`../src/`) pointent au mauvais endroit et Symfony plante au démarrage.

## 3. Base de données PostgreSQL

```bash
# Dans .env.local, adapte DATABASE_URL à ton PostgreSQL réel
php bin/console doctrine:database:create
php bin/console doctrine:migrations:migrate
php bin/console doctrine:fixtures:load
```

La migration `migrations/Version20260818000000.php` crée tout le schéma :
`category`, `product`, `review`, `blog_post`, `user`, `address`, `order`
(avec les colonnes de paiement PAPI + `guest_email` pour les commandes sans
compte), `order_item`.

Compte client de démonstration créé par les fixtures :

| Rôle           | Email                          | Mot de passe                   |
| -------------- | ------------------------------ | ------------------------------ |
| Administrateur | défini dans `ADMIN_USERS_JSON` | défini dans `ADMIN_USERS_JSON` |
| Client         | hanta@example.com              | ChangeMoi123!                  |

Le compte administrateur est créé par les fixtures. En développement, pour
l'injecter dans la base après avoir configuré `DATABASE_URL` :

```bash
php bin/console doctrine:migrations:migrate
php bin/console doctrine:fixtures:load --no-interaction
php bin/console app:admin:sync
```

Pour créer ou réinitialiser uniquement un administrateur sans recharger les
données :

```bash
php bin/console app:super-admin:create --email=admin@mhstore.mg --password="Un-Mot-De-Passe-Solide-2026"
```

L'adresse email du compte admin fixture est déjà vérifiée. Les nouveaux
comptes clients doivent cliquer le lien reçu par email avant de se connecter.

En local, `MESSENGER_TRANSPORT_DSN=sync://` envoie immédiatement le message.
Pour recevoir réellement les emails, configure `MAILER_DSN` avec un SMTP,
par exemple `smtp://utilisateur:motdepasse@smtp.example.com:587` (à mettre
dans `.env.local`, jamais dans Git). `MAILER_DSN=null://null` est uniquement
un transport de développement qui ignore les emails.

## 4. Générer les clés JWT (Lexik)

```bash
php bin/console lexik:jwt:generate-keypair
```

Génère `config/jwt/private.pem` et `config/jwt/public.pem` (chemins déjà
référencés dans `.env`). Renseigne aussi `JWT_PASSPHRASE` dans
`.env.local` avec une vraie valeur secrète — jamais celle par défaut.

## 5. CORS

`config/packages/nelmio_cors.yaml` autorise `CORS_ALLOW_ORIGIN` (regex,
`.env`) uniquement sur les routes `/api/*`. En dev, ça matche
`http://localhost:3000` (Next.js). **En production**, remplace cette regex
par le vrai domaine du frontend — ne jamais laisser une regex permissive
en prod.

## 6. Endpoints API (pour intégration Next.js)

Toutes les réponses sont en JSON. Base URL en dev : `http://localhost:8000`.

| Méthode | Route                              | Auth                     | Description                                                        |
| ------- | ---------------------------------- | ------------------------ | ------------------------------------------------------------------ |
| GET     | `/api/products`                    | Publique                 | Liste, `?categorie=slug&tri=price_asc\|price_desc\|newest\|rating` |
| GET     | `/api/products/featured?limit=4`   | Publique                 | Produits mis en avant (badge)                                      |
| GET     | `/api/products/{slug}`             | Publique                 | Fiche produit + avis + produits liés                               |
| GET     | `/api/categories`                  | Publique                 | Liste des catégories                                               |
| GET     | `/api/blog`                        | Publique                 | Liste des articles                                                 |
| GET     | `/api/blog/{slug}`                 | Publique                 | Article + articles liés                                            |
| POST    | `/api/checkout`                    | Publique (invité) ou JWT | Crée la commande, retourne `paymentLink` PAPI                      |
| GET     | `/api/orders/{reference}`          | Publique                 | Suivi de commande par référence                                    |
| GET     | `/api/account/orders`              | JWT (`ROLE_USER`)        | Historique de commandes du compte connecté                         |
| GET     | `/api/account`                     | JWT (`ROLE_USER`)        | Informations personnelles et adresses du compte                    |
| PUT     | `/api/account`                     | JWT (`ROLE_USER`)        | Modifie prénom, nom et téléphone                                   |
| POST    | `/api/account/addresses`           | JWT (`ROLE_USER`)        | Ajoute une adresse                                                 |
| PUT     | `/api/account/addresses/{id}`      | JWT (`ROLE_USER`)        | Modifie une adresse appartenant au compte                          |
| DELETE  | `/api/account/addresses/{id}`      | JWT (`ROLE_USER`)        | Supprime une adresse appartenant au compte                         |
| POST    | `/api/auth/register`               | Publique                 | Inscription — envoie un email et retourne `{message, email}`       |
| GET     | `/api/auth/verify-email?token=...` | Publique                 | Vérifie l'adresse email et active le compte                        |
| POST    | `/api/auth/login`                  | Publique                 | Géré par Lexik (json_login) — `{email, password}` → `{token}`      |
| GET     | `/api/me`                          | JWT (`ROLE_USER`)        | Profil de l'utilisateur connecté                                   |
| POST    | `/api/contact`                     | Publique                 | Formulaire de contact/support                                      |

**Authentification côté Next.js** : après login, stocker le
`token` reçu (ex. cookie httpOnly posé par une route API Next, ou en
mémoire côté client) et l'envoyer en header `Authorization: Bearer <token>`
sur les routes protégées.

**Corps attendu pour `POST /api/checkout`** :

```json
{
    "lines": [{ "productId": 1, "quantity": 2 }],
    "paymentMethod": "MVOLA",
    "shippingAddress": "Lot II M 12 Bis, Antaninandro",
    "shippingCity": "Antananarivo",
    "clientName": "Hanta Ravalison",
    "email": "hanta@example.com",
    "phone": "0340000000"
}
```

`paymentMethod` accepte `MVOLA`, `ORANGE_MONEY`, `ARTEL_MONEY`, `BRED`
(carte Visa/Mastercard). Les prix sont **toujours recalculés côté serveur**
depuis la base — jamais depuis les valeurs envoyées par le client.

## 7. Paiement — PAPI.mg

Identique au principe déjà en place : `POST /api/checkout` crée la
commande puis appelle PAPI (`POST /payment-links`) pour obtenir un lien de
paiement, retourné dans la réponse JSON. Next.js redirige simplement le
navigateur vers ce lien.

Différence clé par rapport à l'ancienne version Twig : `successUrl` et
`failureUrl` pointent maintenant vers le **frontend Next.js**
(`FRONTEND_URL` + `/checkout/succes/{reference}` ou `/checkout/echec/{reference}`),
pas vers ce backend — c'est Next.js qui affiche ces pages. Seule
`notificationUrl` (le webhook, appelé serveur à serveur par PAPI) reste sur
ce backend : `POST /paiement/papi/notification`.

```
PAPI_API_KEY=<ta clé API PAPI>
PAPI_API_URL=https://app.papi.mg/dashboard/api
PAPI_TEST_MODE=true   # false en production
FRONTEND_URL=http://localhost:3000   # URL du Next.js, adapter en prod
```

## 8. Espace admin (`/admin`, CSS pur)

- `/admin/connexion` — formulaire de connexion (session, pas de JWT)
- `/admin` — tableau de bord (CA, commandes, produits, utilisateurs)
- `/admin/produits`, `/admin/categories`, `/admin/articles` — CRUD
- `/admin/commandes` — liste filtrable par statut + détail + changement de statut + statut de paiement PAPI visible
- `/admin/utilisateurs` — recherche et suppression d’un admin simple (CSRF-protégée). Les rôles sont définis dans `ADMIN_USERS_JSON` puis injectés avec `app:admin:sync`.

Toute la mise en forme est dans **`public/css/admin.css`** — fichier CSS
statique classique, aucune étape de build, aucune dépendance JS requise.

## 9. Super administrateur unique (terminal uniquement)

Inchangé par rapport à la version précédente :

```bash
php bin/console app:super-admin:create --email=admin@mhstore.mg --password="Un-Mot-De-Passe-Solide-2026"
```

```bash
php -r "echo bin2hex(random_bytes(32)), PHP_EOL;"   # génère SUPER_ADMIN_OVERRIDE_CODE
php bin/console app:super-admin:reset --override-code="$SUPER_ADMIN_OVERRIDE_CODE" --password="Nouveau-Mot-De-Passe"
```

Le super admin (`ROLE_SUPER_ADMIN`, hérite de `ROLE_ADMIN`) est unique,
vérifié applicativement (`UserRepository::findSuperAdmin()`), jamais
modifiable via une page web.

## 10. Ce qui reste à brancher côté Next.js

- Stockage du JWT après login/register (cookie httpOnly recommandé, posé
  par une route API Next plutôt que localStorage, pour limiter l'exposition XSS).
- Pages `/checkout/succes/[reference]` et `/checkout/echec/[reference]`
  côté Next.js — purement informatives, jamais une source de vérité sur le
  paiement (seul le webhook PAPI, vérifié par jeton, fait foi côté backend).
- Appeler `GET /api/orders/{reference}` pour afficher le suivi de commande,
  y compris pour un client invité non connecté.
- Panier géré entièrement côté Next.js (ex. Zustand) — le backend ne
  connaît le panier qu'au moment du `POST /api/checkout`.

## 11. Ce qui reste à brancher côté backend

- Envoi d'email réel pour le support et la confirmation de commande —
  brancher `MailerInterface`.
- Vraies photos produit à la place des dégradés `colorFrom`/`colorTo`.
- Pagination sur `/api/products` et `/admin/produits` si le catalogue grossit.
- Rate limiting sur `/api/auth/login` et `/api/checkout` (`symfony/rate-limiter`)
  pour se prémunir du brute-force / spam de commandes.
