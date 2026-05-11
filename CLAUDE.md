# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository layout

Two independent npm projects in one repo:

- `frontend/` — Vite + React 19 SPA (the SECOM/TTDECOM landing page). Run all frontend commands from inside `frontend/`.
- `backend/` — NestJS 11 API server backed by Prisma + MariaDB/MySQL. Run all backend commands from inside `backend/`.

There is no root `package.json` and no workspace tooling — the two halves are developed and run separately.

## Common commands

### Frontend (`cd frontend`)

```bash
npm run dev       # vite dev server
npm run build     # production build to dist/
npm run lint      # eslint .
npm run preview   # serve the built dist/
```

There is no frontend test runner configured.

### Backend (`cd backend`)

```bash
npm run start:dev          # nest start --watch (development)
npm run start              # nest start (no watch)
npm run start:prod         # node dist/src/main.js (after `npm run build`)
npm run build              # nest build
npm run lint               # eslint --fix on src/, apps/, libs/, test/
npm run format             # prettier on src/ and test/

npm run test               # jest (unit, *.spec.ts under src/)
npm run test:watch
npm run test:cov
npm run test:e2e           # jest --config ./test/jest-e2e.json
npx jest path/to/file.spec.ts   # run a single test file
npx jest -t "test name"         # run by test name
```

Prisma:

```bash
npx prisma generate        # regenerates client into backend/generated/prisma (NOT node_modules)
npx prisma migrate dev
npx prisma studio
```

The Prisma client is emitted to `backend/generated/prisma/` (see `prisma/schema.prisma` `output`) and imported via that path, e.g. `from '../../generated/prisma/client.js'`. Don't expect `@prisma/client` to resolve at the usual location.

## Architecture

### Backend (NestJS, ESM, Prisma)

- ESM-only: `package.json` has `"type": "module"` and `tsconfig.json` uses `"module": "nodenext"`. **All intra-project imports must use the `.js` extension** even when importing `.ts` source (e.g. `import { AuthService } from './auth.service.js'`). This is enforced by `nodenext` resolution; omitting the extension will fail at runtime.
- Feature modules live under `src/<feature>/` with the standard Nest triple of `*.module.ts`, `*.controller.ts`, `*.service.ts`, plus `dto/` for request validation. Current modules: `auth`, `job`, `post`, `contact`, `application`, plus the shared `prisma` module.
- Bootstrap (`src/main.ts`):
  - Global API prefix `/api` — every controller path is mounted under `/api/...`.
  - Global `ValidationPipe({ whitelist: true })` — DTOs strip unknown fields; use `class-validator` decorators on every DTO field that should be accepted.
  - CORS is `origin: true, credentials: true` (any origin, cookies allowed).
  - Static file serving: `/upload` (public uploads), `/secured` (CV uploads), and `/images` (bundled images). The first two come from `process.env.ROOT_UPLOAD_DIR || ./file_storage`.
- Database: Prisma with the **MariaDB driver adapter** (`@prisma/adapter-mariadb`), wired manually in `PrismaService`. The schema mirrors a legacy Java/Hibernate database (`tbl_*` table names, FK names like `FK3dlsnshmuceavj1elp5kufni4`) — treat the schema as fixed, don't rename tables/columns. IDs are `BigInt`; convert with `Number(...)` / `BigInt(...)` at the boundary (see `JwtStrategy.validate`).
- Auth (`src/auth/`):
  - JWT is stored in an `httpOnly` cookie named `access_token`, set/cleared by `AuthController`. The frontend never sees the token — it relies on `withCredentials: true` on every axios call.
  - `JwtStrategy` extracts the token from `req.cookies.access_token` (not the `Authorization` header — the README's "Bearer" examples are out of date).
  - `JwtAuthGuard` + `RolesGuard` + `@Roles('ROLE_ADMIN')` decorator gate admin endpoints. Roles live in the `tbl_system_users.role` column as strings (`ROLE_ADMIN`, `ROLE_CUSTOMER`).
- File uploads use `multer` with `diskStorage`. Public images go under `<ROOT_UPLOAD_DIR>/upload`; CVs go under `<ROOT_UPLOAD_DIR>/secured`. Image uploads validate `mimetype.startsWith('image/')` with a 10MB cap; CVs accept PDF/DOC/DOCX with a 5MB cap.

Required env (`backend/.env`):

```
DATABASE_URL="mysql://user:pass@host:3306/dbname"
JWT_SECRET="..."
JWT_EXPIRES_IN="1d"
PORT=3000                         # optional, defaults to 3000
ROOT_UPLOAD_DIR=/abs/path         # optional, defaults to ./file_storage
NODE_ENV=production               # cookies become Secure when set
```

### Frontend (React 19 + Vite + Redux Toolkit)

- Entry: `src/main.jsx` mounts `<Provider store><BrowserRouter><LanguageProvider><App/></...>` — Redux, router, and i18n are all global.
- Routing (`src/App.jsx`) uses a single `MainLayout` route wrapping every page. The catch-all `path="*"` redirects to `Home` rather than showing a 404.
- State: a single Redux slice (`src/store/authSlice.js`) for auth. `App.jsx` dispatches `checkAuth()` on mount, which calls `GET /api/auth/profile` with `withCredentials: true` to rehydrate the user from the JWT cookie. There is no token in localStorage — auth state lives in the cookie + Redux.
- API base URL: `src/config/api.js` exports `API_URL` (defaults to `http://localhost:3000/api`) and `BACKEND_URL` (for absolute asset paths). Override per-environment via `VITE_API_URL` and `VITE_BACKEND_URL`. **Every axios call that touches an authenticated endpoint must pass `{ withCredentials: true }`** — the cookie won't be sent otherwise.
- i18n: hand-rolled. `src/i18n/LanguageContext.jsx` provides `{ lang, setLang, t }` via `useLanguage()`. Strings are looked up as `t.someKey` from `src/i18n/translations.js` (keys: `en`, presumably `vi`).
- Build/styling stack: Vite 8 + React Compiler (enabled via `babel-plugin-react-compiler` in `vite.config.js`) + Tailwind CSS 4 (via `@tailwindcss/vite`). The React Compiler is on by default — avoid hand-written `useMemo`/`useCallback` micro-optimizations that fight it.
- ESLint rule worth knowing: `no-unused-vars` ignores identifiers matching `^[A-Z_]` (so `const _Foo = ...` and uppercase consts won't trip it).

### Frontend ↔ backend wiring

- All API paths the frontend hits start with `/api/...` because of the backend's global prefix. Don't omit it.
- Auth flow: login/register POST returns `{ user }` (the token is set as a cookie, not in the body); `checkAuth` is the rehydration call; `logout` POST clears the cookie. The Redux slice stores only the `user`, never a token.
- Uploaded image URLs returned by the backend are paths like `/upload/<uuid>.png`. Prepend `BACKEND_URL` from `src/config/api.js` to render them.

## Conventions / gotchas

- **Backend imports must end in `.js`** — see ESM note above. New files should follow the existing `import { X } from './x.js'` pattern.
- **Prisma client path is non-standard** (`generated/prisma/`) — re-run `npx prisma generate` after pulling schema changes or the import will break.
- **Don't rename `tbl_*` tables or their FK `map:` names** in `schema.prisma` — they match a legacy database and migrations would break against existing data.
- **Cookie auth, not Bearer** — the backend README's `Authorization: Bearer ...` examples don't reflect the current implementation. Use `withCredentials: true` from the frontend.
- **Catch-all route renders Home** rather than a 404 (`App.jsx`). Keep that in mind when adding routes — typos will silently land on Home.
- Uploads are written outside the repo by default (`./file_storage`) and ignored by `.gitignore` (`uploads/`, `upload/`, `images/`, `secured/`). Don't commit user-uploaded content.
