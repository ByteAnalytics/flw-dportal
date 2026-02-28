# IFRACREDIT App

A Next.js 15 TypeScript application with Tailwind CSS, Shadcn UI components, React Query, and small utility providers and stores — meant as a starting point for building IFRS-related UIs.

Key features

- Next.js 15 App Router (TypeScript)
- Tailwind CSS (v4) + PostCSS
- Radix UI primitives and Lucide icons
- React Query (TanStack) + React Query Devtools
- Zustand for lightweight state
- React Hook Form + Zod for forms and validation

## 🚀 Deployment & CI/CD Overview

This project is production-ready with complete Docker containerization and automated CI/CD pipeline:

### Docker Deployment

- ✅ **Multi-stage Dockerfile** optimized for Next.js with standalone output
- ✅ **Development & Production** docker-compose configurations
- ✅ **Health checks** and resource limits for production
- ✅ **Security hardened** - runs as non-root user
- ✅ **Nginx support** - optional reverse proxy configuration included

### GitHub Actions CI/CD

- ✅ **Automated linting** and build checks on every PR
- ✅ **Docker image builds** - separate dev (`ridzy619/infracredit-frontend-dev`) and production (`ridzy619/infracredit-frontend`) images
- ✅ **DockerHub integration** - auto-push on every commit to main/feat branches
- ✅ **Smart triggers** - PRs run tests only, pushes build and deploy
- ✅ **Version tagging** - commit SHA tags for easy rollback
- ✅ **VM deployment** - automatic deployment to VM via SSH on push to main

### Quick Deployment Options

**Option 1: Local Docker**

```bash
docker-compose up -d --build
```

**Option 2: Pre-built Images**

```bash
# Production image
docker pull ridzy619/infracredit-frontend
docker run -d -p 3000:3000 ridzy619/infracredit-frontend

# Development image
docker pull ridzy619/infracredit-frontend-dev
docker run -d -p 3000:3000 ridzy619/infracredit-frontend-dev
```

**Option 3: Vercel** (quick deployment)

**See [Deployment](#deployment) and [CI/CD Pipeline](#cicd-pipeline) sections below for details.**

---

## Repository layout (high level)

- `app/` — Next.js app router pages and layout
- `components/` — Reusable UI components (see `components/ui/`)
- `api/` — API clients and auth helpers (e.g. `cookie-auth.ts`, `client.ts`)
- `hooks/` — Custom hooks and React Query queries
- `providers/` — App-level providers (e.g. `QueryProvider.tsx`)
- `stores/` — Providers and Stores (e.g. `auth-store.ts, AuthContext.ts`)
- `types/` — Shared TypeScript types
- `public/` — Static assets
- `.github/workflows/` — CI/CD pipeline configuration
- `Dockerfile` — Multi-stage Docker build
- `docker-compose.yml` — Development container setup
- `docker-compose.production.yml` — Production container setup

## Requirements

- Node.js 20+ (recommended)
- npm, yarn or pnpm
- Recommended editor: VS Code (with TypeScript and Tailwind CSS extensions)

## Quick start (development)

1. Install dependencies

```powershell
npm install
```

2. Run the development server

```powershell
npm run dev
```

Open `http://localhost:3000` in your browser. The project uses Next's Turbopack for local development per the `dev` script.

## Build & production

Build the application for production:

```powershell
npm run build
```

Start the production server (after building):

```powershell
npm run start
```

## Available scripts

Listed from `package.json`:

- `dev` — `next dev --turbopack`
- `build` — `next build --turbopack`
- `start` — `next start`
- `lint` — `next lint`
- `lint-staged` — `lint-staged` (used by pre-commit)
- `format` — `prettier --check .`
- `format:fix` — `npx prettier --write --list-different .`
- `prepare` — `husky || true`

If you use `yarn`/`pnpm`, run equivalent commands (`yarn dev`, `pnpm dev`, etc.).

## Environment variables

Create a `.env.local` at the project root for local development. Example variables (adjust to your needs):

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
JWT_SECRET=your_jwt_secret_here
```

Do not commit secrets. Use your hosting platform's environment configuration for production keys.

## Auth and API patterns

- Inspect `api/client.ts` for an Axios instance and interceptors.
- `api/cookie-auth.ts` contains utility functions to read and write cookies for auth tokens (server + client aware).
- `stores/auth-store.ts` contains a small Zustand store for auth state.

When updating cookie or token names, update all references in `api/` and `stores/`.

## Linting, formatting & commit hooks

- Prettier is configured for formatting checks and fixes (`format`, `format:fix`).
- Commitlint and Husky are configured to enforce conventional commit messages and run pre-commit hooks. See `.husky/` and `commitlint.config.ts`.

## Testing

No unit or e2e tests are included by default. Recommended next steps:

- Add unit tests with Jest + React Testing Library
- Add end-to-end tests with Playwright or Cypress

## Deployment

### Vercel (Recommended for quick deployment)

This repo is ready for Vercel deployment. Connect the repository to Vercel and add the required environment variables.

### Docker (Containerized deployment)

The application includes Docker support for containerized deployment with separate configurations for development and production.

#### Prerequisites

- Docker 20.10+
- Docker Compose 1.29+

#### Environment Setup

⚠️ **Important**: `NEXT_PUBLIC_API_BASE_URL` is a build-time variable that must be set before building.

Create a `.env` file in the project root:

```env
NEXT_PUBLIC_API_BASE_URL=https://your-api-url.com
```

#### Development Deployment

```bash
# Build and start the development container
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop the container
docker-compose down
```

The application will be available at `http://localhost:3000`

#### Production Deployment

```bash
# Build and start the production container
docker-compose -f docker-compose.production.yml up -d --build

# View logs
docker-compose -f docker-compose.production.yml logs -f

# Stop the container
docker-compose -f docker-compose.production.yml down
```

#### Helper Scripts

For easier deployment management:

```bash
# Interactive deployment (choose dev or production)
./scripts/deploy.sh

# View logs
./scripts/logs.sh

# Build image with version tag
./scripts/build.sh
```

#### Alternative: Set Environment Variable Inline

If you don't have a `.env` file:

```bash
NEXT_PUBLIC_API_BASE_URL=https://api.example.com docker-compose up -d --build
```

#### Common Commands

```bash
# Rebuild after code changes
docker-compose down && docker-compose up -d --build

# Access container shell
docker exec -it infracredit-frontend-dev sh

# View all running containers
docker ps

# Remove all containers and images (clean slate)
docker-compose down && docker system prune -a
```

#### Docker Files Included

- `Dockerfile` - Multi-stage build optimized for Next.js (standalone output enabled)
- `docker-compose.yml` - Development deployment (container: `infracredit-frontend-dev`)
- `docker-compose.production.yml` - Production with health checks and resource limits
- `.dockerignore` - Build optimization (excludes node_modules, .git, etc.)
- `nginx.conf.example` - Optional reverse proxy configuration for production
- `next.config.ts` - Updated with `output: "standalone"` for Docker optimization

#### Troubleshooting

**Container won't start:**

```bash
docker-compose logs infracredit-frontend-dev
```

**Port 3000 already in use:**
Edit `docker-compose.yml` and change the port mapping:

```yaml
ports:
  - "8080:3000"
```

**Build fails:**

```bash
docker builder prune -a
docker-compose build --no-cache
```

**API calls fail:**
Verify `NEXT_PUBLIC_API_BASE_URL` is set correctly in your `.env` file and rebuild.

## CI/CD Pipeline

This project includes two GitHub Actions workflows for automated CI/CD and deployment.

### Workflow 1: CI/CD Pipeline (`ci-cd.yml`)

Automatically lints, builds, and pushes Docker images to DockerHub.

#### Quick Setup

1. **Add GitHub Secrets**:
   - `DOCKERHUB_USERNAME` - Your DockerHub username
   - `DOCKERHUB_TOKEN` - DockerHub access token

2. **Add GitHub Variables** (non-sensitive):
   - `NEXT_PUBLIC_API_BASE_URL_PROD` - Production API URL (required)
   - `NEXT_PUBLIC_API_BASE_URL_DEV` - Development API URL (optional, defaults to `http://localhost:8000`)
   - `NEXT_PUBLIC_API_BASE_URL` - For lint/build job (optional, defaults to `http://localhost:8000`)

3. **Pipeline triggers on**:
   - **Pull Requests to main**: Runs lint and build only (fast feedback, ~3-5 min)
   - **Push to feat/deployment**: Lint, build, and push dev image
   - **Push to main**: Lint, build, and push both dev and prod images

4. **Built images**:
   - Development: `ridzy619/infracredit-frontend-dev` and `ridzy619/infracredit-frontend-dev:{commit-sha}`
   - Production: `ridzy619/infracredit-frontend` and `ridzy619/infracredit-frontend:{commit-sha}`

#### Pipeline Jobs

**Job 1: lint-and-build**

- Runs on: All pushes and pull requests
- Node.js: 20.x
- Steps:
  1. Install dependencies (`npm ci`)
  2. Lint code (`npm run lint`)
  3. Build project (`npm run build`)
- Environment: `NEXT_PUBLIC_API_BASE_URL` from variables or defaults to `http://localhost:8000`

**Job 2: build-and-push-dev**

- Runs on: Push events only (not PRs)
- Requires: lint-and-build to pass
- Builds Docker image: `ridzy619/infracredit-frontend-dev`
- Tags: latest + commit SHA
- Uses: `NEXT_PUBLIC_API_BASE_URL_DEV` variable

**Job 3: build-and-push-prod**

- Runs on: Push to main branch only
- Requires: lint-and-build to pass
- Builds Docker image: `ridzy619/infracredit-frontend`
- Tags: latest + commit SHA
- Uses: `NEXT_PUBLIC_API_BASE_URL_PROD` variable

#### Workflow Visualization

```
┌─────────────────┐
│   Pull Request  │ → lint-and-build only (~3-5 min)
└─────────────────┘

┌─────────────────┐
│ Push to feat/*  │ → lint-and-build → build-and-push-dev (~8-10 min)
└─────────────────┘

┌─────────────────┐
│  Push to main   │ → lint-and-build → build-dev + build-prod (~12-15 min)
└─────────────────┘
```

### Workflow 2: VM Deployment (`deploy.yml`)

Automatically deploys to a VM via SSH after successful builds.

#### Triggers

- **Push to main** - Deploys after CI/CD completes
- **Manual trigger** - Via GitHub Actions UI (workflow_dispatch)

#### Configuration Required

**GitHub Secrets** (for SSH deployment):

- `VM_HOST` - VM IP address or hostname
- `VM_USERNAME` - SSH username for the VM
- `SSH_PRIVATE_KEY` - SSH private key for authentication

#### Deployment Process

The workflow:

1. Connects to VM via SSH
2. Pulls the latest `infracredit-frontend-dev` image
3. Starts the container with docker compose
4. Shows logs if deployment fails

```bash
# Commands executed on VM:
docker compose pull infracredit-frontend-dev
docker compose up infracredit-frontend-dev -d --no-build --wait || docker compose logs infracredit-frontend-dev
```

### Complete Configuration Checklist

**GitHub Secrets** (Settings → Secrets and variables → Actions → Secrets):

- `DOCKERHUB_USERNAME` - Your DockerHub username
- `DOCKERHUB_TOKEN` - DockerHub access token
- `VM_HOST` - VM IP/hostname (for deployment)
- `VM_USERNAME` - VM SSH username (for deployment)
- `SSH_PRIVATE_KEY` - SSH private key (for deployment)

**GitHub Variables** (Settings → Secrets and variables → Actions → Variables):

- `NEXT_PUBLIC_API_BASE_URL_PROD` - Production API URL (required)
- `NEXT_PUBLIC_API_BASE_URL_DEV` - Development API URL (optional)
- `NEXT_PUBLIC_API_BASE_URL` - For build testing (optional)

### Using Pre-built Images

Instead of building locally, you can use the pre-built images from DockerHub (automatically built via CI/CD):

```bash
# Pull and run production image (built from main branch)
docker pull ridzy619/infracredit-frontend
docker run -d -p 3000:3000 ridzy619/infracredit-frontend

# Or use specific commit version for rollback
docker pull ridzy619/infracredit-frontend:abc1234
docker run -d -p 3000:3000 ridzy619/infracredit-frontend:abc1234

# Pull and run development image (built from feat/deployment)
docker pull ridzy619/infracredit-frontend-dev
docker run -d -p 3000:3000 ridzy619/infracredit-frontend-dev
```

### Manual VM Deployment

If you want to deploy manually instead of using the automated workflow:

```bash
# SSH into your VM
ssh user@your-vm-host

# Pull latest image
docker compose pull infracredit-frontend-dev

# Start the container
docker compose up infracredit-frontend-dev -d --no-build

# Check logs
docker compose logs -f infracredit-frontend-dev
```

## Contributing

- Follow existing code style and TypeScript usage.
- Run `npm run format:fix` before committing.
- Commit messages should follow conventional commits (commitlint will validate).
- CI/CD pipeline will automatically build and test your changes on push.

## Troubleshooting

- If you see dev server errors, try removing `.next/` and re-running `npm run dev`.
- If types are stale, restart your editor's TS server.

## 📦 Deployment & CI/CD Files

The following files were added/modified to enable Docker deployment and CI/CD:

### Docker Configuration

- `Dockerfile` - Multi-stage build (deps → builder → runner)
- `docker-compose.yml` - Development environment
- `docker-compose.production.yml` - Production environment with health checks
- `.dockerignore` - Optimize build context
- `nginx.conf.example` - Optional reverse proxy template
- `next.config.ts` - Updated with `output: "standalone"`

### CI/CD Workflows

- `.github/workflows/ci-cd.yml` - Automated lint, build, and Docker push to DockerHub
- `.github/workflows/deploy.yml` - Automated deployment to VM via SSH

### Key Features

- **Build-time environment variables** properly configured via build args
- **Multi-environment support** (development and production)
- **Automated image tagging** with commit SHA for rollback capability
- **Health checks** for production containers
- **Resource limits** to prevent excessive resource consumption
- **Security hardening** - containers run as non-root user (nextjs:1001)

### Image Repositories

**Production Images**

- Repository: `ridzy619/infracredit-frontend`
- Tags: `latest` (implicit), `{commit-sha}`
- Built on: Push to `main` branch
- Used for: Production deployments

**Development Images**

- Repository: `ridzy619/infracredit-frontend-dev`
- Tags: `latest` (implicit), `{commit-sha}`
- Built on: Push to `main` or `feat/deployment` branches
- Used for: Development/staging environments and VM deployments

### Deployment Flow

```
Code Push → GitHub
     ↓
CI/CD Pipeline (ci-cd.yml)
     ├─ Lint & Build
     ├─ Push to DockerHub
     ↓
VM Deployment (deploy.yml)
     ├─ SSH to VM
     ├─ Pull latest image
     └─ Start container
     ↓
Application Running on VM
```
