## Links

| | URL |
|---|---|
| Frontend | https://report.studycase.kanzen.my.id |
| Backend API | https://api.report.studycase.kanzen.my.id/ |
| API docs (Swagger) | https://api.report.studycase.kanzen.my.id/api-docs |

## Demo accounts

| Role | Email | Password | Can |
|---|---|---|---|
| Admin | administrator@gmail.com | Admin1234! | Manage user accounts |
| Approver | approver@gmail.com | Approver1234! | Review all reports, approve or reject them |
| Reporter | reporter1@gmail.com | Reporter1234! | Submit reports, edit them while pending |
| Reporter | reporter2@gmail.com | Reporter1234! | Submit reports, edit them while pending |

## Getting started

```bash
npm install
npm run dev
```

Requests to `/api/*` are proxied by Vite to the backend at `http://localhost:3000`. To use the deployed backend instead, set `VITE_API_BASE_URL` (see `.env.example`):

```
VITE_API_BASE_URL=https://api.report.studycase.kanzen.my.id/api/v1
```

## Packages

### Dependencies

| Package | Version | Used for |
|---|---|---|
| react, react-dom | ^19.2.8 | UI library |
| react-router-dom | ^7.18.4 | Routing, route guards, filter state in the URL |
| tailwindcss | ^4.3.3 | Styling |
| @tailwindcss/vite | ^4.3.3 | Tailwind integration for Vite |
| shadcn | ^4.21.4 | shadcn/ui CLI and base styles |
| @base-ui/react | ^1.9.0 | Headless primitives behind the shadcn components |
| class-variance-authority | ^0.7.1 | Component style variants |
| cn | ^0.4.0 | Merge Tailwind class names |
| tw-animate-css | ^1.4.0 | Animation utilities |
| lucide-react | ^1.55.0 | Icons |
| sonner | ^2.0.8 | Toast notifications |
| next-themes | ^0.4.6 | Theme hook used by the toast component |
| @fontsource-variable/geist | ^5.3.0 | Geist font |

### Dev dependencies

| Package | Version | Used for |
|---|---|---|
| vite | ^8.3.0 | Dev server and bundler |
| @vitejs/plugin-react | ^6.1.1 | React support for Vite |
| typescript | ~6.0.2 | TypeScript compiler |
| eslint | ^10.10.0 | Linting |
| @eslint/js, typescript-eslint | ^10.0.1, ^8.69.0 | ESLint rules for JavaScript and TypeScript |
| eslint-plugin-react-hooks | ^7.1.1 | Rules of Hooks linting |
| eslint-plugin-react-refresh | ^0.5.6 | Fast Refresh safe exports |
| globals | ^17.12.0 | Browser globals for ESLint |
| @types/node, @types/react, @types/react-dom | - | Type definitions |

## Architecture

The app follows clean architecture: dependencies point inward, and the domain/application layer (`modules/`) has no knowledge of React or the UI.

```
presentation   | app/, components/, hooks/, providers/      (React)
      |  
      | calls usecases
      v
application    | modules/<feature>/usecases, validations, permissions, filters
      |  
      | uses
      v
    domain     | modules/<feature>/types.ts
      ^
infrastructure | modules/<feature>/repositories -> lib/http   (API & storage)
```

These boundaries are enforced by ESLint (`no-restricted-imports` in `eslint.config.js`):

- `modules/` may not import React, UI libraries, or anything from `app/`, `components/`, `hooks/`, `providers/`.
- The presentation layer may not import `modules/*/repositories/*` directly; it goes through a usecase.

## Folder structure

All source code lives in `src/`, with the `@/` alias -> `src/`.

```
src/
|-- main.tsx                     # entry: global providers (router, auth, tooltip, toaster)
|-- index.css                    # Tailwind theme + shadcn tokens
|
|-- app/                         # PRESENTATION - routes & pages (one folder = one route)
|   |-- router.tsx
|   |-- route-guards.tsx         # RequireAuth, GuestOnly, RequireRole
|   |-- auth/login/page.tsx
|   `-- dashboard/
|       |-- layout.tsx           # sidebar + header
|       |-- page.tsx
|       |-- _components/         # UI used only by this route (reports/users overview)
|       |-- profile/
|       |   |-- page.tsx
|       |   `-- _components/     # profile & password forms, summary card
|       |-- reports/page.tsx
|       `-- users/
|           |-- page.tsx
|           `-- _components/     # users filters
|-- components/                  # PRESENTATION - reusable UI
|   |-- ui/                      # shadcn components (generated)
|   |-- layout/                  # app sidebar & navigation
|   |-- shared/                  # generic building blocks (PageHeader, StatCard, PaginationBar, ...)
|   |-- reports/                 # report UI shared across routes (table, dialogs, status badge)
|   `-- users/                   # user UI shared across routes (table, form dialog, role badge)
|-- hooks/                       # PRESENTATION - React hooks (use-auth, use-reports, use-users, ...)
|-- providers/                   # PRESENTATION - context providers (AuthProvider)
|-- lib/                         # INFRASTRUCTURE - http client, formatters, cn
|
`-- modules/                     # DOMAIN + APPLICATION - framework-agnostic, no React
    `-- <feature>/               # auth | reports | users | profile
        |-- types.ts             # entities & payloads
        |-- usecases/            # business rules, the only entry point for the UI
        |-- validations/         # input validation
        |-- permissions.ts       # role-based access rules (reports)
        |-- filters.ts           # list filter state <-> URL <-> API params (users)
        `-- repositories/        # API / storage access (used by usecases only)
```

Conventions:

- `_components/` (underscore prefix) holds components private to a route; it is not a route itself.
- A component used by more than one route lives in `components/<feature>/`, never in another route's folder.
- Within a module use relative imports (`../types`); across layers or modules use the `@/` alias.
