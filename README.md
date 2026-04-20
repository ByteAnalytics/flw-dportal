# FLW Dportal FE 

A Next.js 15 TypeScript application with Tailwind CSS, Shadcn UI components, React Query, and small utility providers and stores — meant as a starting point for building IFRS-related UIs.

## Key Features

- Next.js 15 App Router (TypeScript)
- Tailwind CSS (v4) + PostCSS
- Radix UI primitives and Lucide icons
- React Query (TanStack) + React Query Devtools
- Zustand for lightweight state
- React Hook Form + Zod for forms and validation

---

## Repository Layout

```
app/                        # Next.js App Router pages and layouts
components/
  ui/                       # Base UI primitives (Button, Sidebar, Sheet, etc.)
  shared/                   # Shared cross-feature components (e.g. StatCard)
  navigation/
    NavMain.tsx             # Sidebar nav — main links, My Team, Active APIs

dashboard/
  types.ts                  # Shared Process interface
  data.ts                   # PROCESSES array, ICON_MAP, CATEGORY_STYLES
  ProcessCard.tsx           # Individual process card component
  index.tsx                 # Dashboard page; re-exports Process, ProcessCard, PROCESSES
  RecentActivities.tsx      # Recent activities table with pagination

  run-process/
    constants.ts            # Types (DataSourceType, PanelStep, etc.), mock API data, filter helpers
    FilterDropdown.tsx      # Reusable filter dropdown wrapper
    StepTabs.tsx            # 3-step tab navigator (Data Source → Configure → Execute)
    DataSourceStep.tsx      # Step 1 — file upload and API connection selection
    ConfigureStep.tsx       # Step 2 — output format, dates, priority, notes
    ExecuteStep.tsx         # Step 3 — running spinner and completion summary
    page.tsx                # Orchestrator — manages state and wires all steps together

api/                        # API clients and auth helpers (client.ts, cookie-auth.ts)
hooks/                      # Custom hooks and React Query queries
providers/                  # App-level providers (QueryProvider.tsx)
stores/                     # Zustand stores (auth-store.ts, AuthContext.ts)
types/                      # Shared TypeScript types
public/                     # Static assets
.github/workflows/          # CI/CD pipeline configuration
Dockerfile                  # Multi-stage Docker build
docker-compose.yml          # Development container setup
docker-compose.production.yml  # Production container setup
```

---

## 🚀 Deployment & CI/CD Overview

This project is production-ready with complete Docker containerization and an automated CI/CD pipeline.

### Docker Deployment

- ✅ **Multi-stage Dockerfile** optimized for Next.js with standalone output
- ✅ **Development & Production** docker-compose configurations
- ✅ **Health checks** and resource limits for production
- ✅ **Security hardened** — runs as non-root user
- ✅ **Nginx support** — optional reverse proxy configuration included

### GitHub Actions CI/CD

- ✅ **Automated linting** and build checks on every PR
- ✅ **DockerHub integration** — auto-push on every commit to main/feat branches
- ✅ **Smart triggers** — PRs run tests only, pushes build and deploy
- ✅ **Version tagging** — commit SHA tags for easy rollback
- ✅ **VM deployment** — automatic deployment to VM via SSH on push to main


**Option 3: Vercel** (quick deployment)

---

## Requirements

- Node.js 20+
- npm, yarn, or pnpm
- Recommended editor: VS Code (with TypeScript and Tailwind CSS extensions)

## Quick Start (Development)

1. Install dependencies
```bash
npm install
```

2. Run the development server
```bash
npm run dev
```

Open `http://localhost:3000` in your browser. The project uses Next's Turbopack for local development.

## Build & Production

```bash
npm run build
npm run start
```

## Available Scripts

| Script | Command |
|---|---|
| `dev` | `next dev --turbopack` |
| `build` | `next build --turbopack` |
| `start` | `next start` |
| `lint` | `next lint` |
| `lint-staged` | `lint-staged` |
| `format` | `prettier --check .` |
| `format:fix` | `npx prettier --write --list-different .` |
| `prepare` | `husky \|\| true` |

## Environment Variables

Create a `.env.local` at the project root for local development:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
JWT_SECRET=your_jwt_secret_here
```

Do not commit secrets. Use your hosting platform's environment configuration for production keys.

## Auth and API Patterns

- `api/client.ts` — Axios instance with interceptors
- `api/cookie-auth.ts` — Utility functions to read/write auth token cookies (server + client aware)
- `stores/auth-store.ts` — Zustand store for auth state

When updating cookie or token names, update all references in `api/` and `stores/`.

## Linting, Formatting & Commit Hooks

- **Prettier** for formatting checks and fixes (`format`, `format:fix`)
- **Commitlint + Husky** enforce conventional commit messages and run pre-commit hooks (see `.husky/` and `commitlint.config.ts`)

## Testing

No unit or e2e tests are included by default. Recommended next steps:

- Add unit tests with Jest + React Testing Library
- Add end-to-end tests with Playwright or Cypress

---

## Deployment

### Vercel

Connect the repository to Vercel and add the required environment variables.

### Docker

#### Prerequisites
- Docker 20.10+
- Docker Compose 1.29+

#### Environment Setup

⚠️ `NEXT_PUBLIC_API_BASE_URL` is a build-time variable that must be set before building.

Create a `.env` file in the project root:
```env
NEXT_PUBLIC_API_BASE_URL=https://your-api-url.com
```

#### Development
```bash
docker-compose up -d --build
docker-compose logs -f
docker-compose down
```

#### Production
```bash
docker-compose -f docker-compose.production.yml up -d --build
docker-compose -f docker-compose.production.yml logs -f
docker-compose -f docker-compose.production.yml down
```

#### Helper Scripts
```bash
./scripts/deploy.sh   # Interactive deployment (choose dev or production)
./scripts/logs.sh     # View logs
./scripts/build.sh    # Build image with version tag
```

```

#### Troubleshooting

| Problem | Solution |
|---|---|
| Container won't start | `docker-compose logs infracredit-frontend-dev` |
| Port 3000 in use | Change port mapping in `docker-compose.yml` to `"8080:3000"` |
| Build fails | `docker builder prune -a && docker-compose build --no-cache` |
| API calls fail | Verify `NEXT_PUBLIC_API_BASE_URL` in `.env` and rebuild |

---

## CI/CD Pipeline

### Workflow 1: CI/CD (`ci-cd.yml`)

#### Setup

1. **GitHub Secrets:**
   - `DOCKERHUB_USERNAME`
   - `DOCKERHUB_TOKEN`

2. **GitHub Variables:**
   - `NEXT_PUBLIC_API_BASE_URL_PROD` (required)
   - `NEXT_PUBLIC_API_BASE_URL_DEV` (optional, defaults to `http://localhost:8000`)
   - `NEXT_PUBLIC_API_BASE_URL` (optional, defaults to `http://localhost:8000`)

#### Pipeline Triggers

```
Pull Request to main   → lint-and-build only            (~3–5 min)
Push to feat/*         → lint-and-build → push dev image (~8–10 min)
Push to main           → lint-and-build → push dev + prod (~12–15 min)
```

#### Jobs

**lint-and-build** — runs on all pushes and PRs; installs, lints, and builds.

**build-and-push-dev** — runs on push only; builds and tags `ridzy619/infracredit-frontend-dev` with `latest` and commit SHA.

**build-and-push-prod** — runs on push to main only; builds and tags `ridzy619/infracredit-frontend` with `latest` and commit SHA.

### Workflow 2: VM Deployment (`deploy.yml`)

Deploys to a VM via SSH after a successful build.

#### Required Secrets
- `VM_HOST`
- `VM_USERNAME`
- `SSH_PRIVATE_KEY`

#### Deployment Steps
1. SSH into VM
2. Pull latest `infracredit-frontend-dev` image
3. Start container via docker compose
4. Show logs on failure

```bash
docker compose pull infracredit-frontend-dev
docker compose up infracredit-frontend-dev -d --no-build --wait \
  || docker compose logs infracredit-frontend-dev
```

### Full Deployment Flow

```
Code Push → GitHub
     ↓
CI/CD Pipeline (ci-cd.yml)
     ├─ Lint & Build
     └─ Push to DockerHub
          ↓
VM Deployment (deploy.yml)
     ├─ SSH to VM
     ├─ Pull latest image
     └─ Start container
          ↓
     App live on VM
```

---

## Docker Files Reference

| File | Purpose |
|---|---|
| `Dockerfile` | Multi-stage build (deps → builder → runner) |
| `docker-compose.yml` | Development environment |
| `docker-compose.production.yml` | Production with health checks and resource limits |
| `.dockerignore` | Optimize build context |
| `nginx.conf.example` | Optional reverse proxy template |
| `next.config.ts` | Updated with `output: "standalone"` |
| `.github/workflows/ci-cd.yml` | Lint, build, and Docker push |
| `.github/workflows/deploy.yml` | SSH deployment to VM |

---

## Contributing

- Follow existing code style and TypeScript usage.
- Run `npm run format:fix` before committing.
- Use conventional commit messages (commitlint enforces this).
- CI/CD will automatically build and test your changes on push.

## Troubleshooting

- Dev server errors → remove `.next/` and re-run `npm run dev`
- Stale types → restart your editor's TS server

C:\Users\RaymondChen\Desktop\Ops Automation portal\dportal_platform_frontend