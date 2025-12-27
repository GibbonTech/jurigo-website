# Jurigo - Création d'entreprise en ligne

Plateforme LegalTech française pour la création d'entreprise en ligne.

## Stack technique

- **Frontend**: TanStack Start (React)
- **ORM**: Drizzle ORM (PostgreSQL)
- **Auth**: Better Auth
- **UI**: shadcn/ui + Tailwind CSS
- **Storage**: Cloudflare R2
- **Deployment**: Docker / Coolify

## Formes juridiques supportées

- SAS (Société par Actions Simplifiée)
- SASU (Société par Actions Simplifiée Unipersonnelle)
- SARL (Société à Responsabilité Limitée)
- EURL (Entreprise Unipersonnelle à Responsabilité Limitée)
- Auto-entrepreneur (Micro-entreprise)

## Installation

```bash
# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.example .env
```

### Option 1: Base de données Neon (recommandé pour le dev)

1. Créer un compte gratuit sur [neon.tech](https://neon.tech)
2. Créer un nouveau projet
3. Copier l'URL de connexion dans `.env`:
   ```
   DATABASE_URL=postgresql://user:password@ep-xxx.eu-central-1.aws.neon.tech/jurigo?sslmode=require
   ```
4. Appliquer les migrations:
   ```bash
   npm run db:push
   ```

### Option 2: PostgreSQL local avec Docker

```bash
# Lancer PostgreSQL
docker compose up db -d

# Appliquer les migrations
npm run db:push
```

### Option 3: PostgreSQL local (Homebrew)

```bash
# Installer PostgreSQL
brew install postgresql@16
brew services start postgresql@16

# Créer la base de données
createdb jurigo

# Mettre à jour DATABASE_URL dans .env
# DATABASE_URL=postgresql://localhost:5432/jurigo

# Appliquer les migrations
npm run db:push
```

### Lancer le serveur

```bash
npm run dev
```

L'application sera disponible sur http://localhost:3000

## Scripts disponibles

- `npm run dev` - Serveur de développement
- `npm run build` - Build de production
- `npm run start` - Lancer en production
- `npm run db:generate` - Générer les migrations
- `npm run db:migrate` - Appliquer les migrations
- `npm run db:push` - Push le schéma vers la DB
- `npm run db:studio` - Ouvrir Drizzle Studio

## Structure du projet

```
src/
├── components/ui/    # Composants shadcn/ui
├── db/               # Schéma et connexion Drizzle
├── lib/              # Utilitaires (auth, r2, utils)
├── routes/           # Routes TanStack
│   ├── admin/        # Dashboard admin
│   ├── auth/         # Login/Register
│   ├── creer/        # Flow de création
│   └── dashboard/    # Espace client
└── styles/           # CSS global
```

## Déploiement Docker

```bash
# Build et lancer tous les services
docker compose up --build

# Ou uniquement la base de données pour le dev
docker compose up db -d
```

## Variables d'environnement

Voir `.env.example` pour la liste complète des variables requises.
