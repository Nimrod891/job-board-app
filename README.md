## jobapp Job Board – Full‑Stack Project

Lightweight job board built for the jobapp project.  
The project is split into a **Node.js + Express + PostgreSQL backend** and a **React + TypeScript + Chakra UI frontend**, following a simple layered architecture.

---

## Contents

- **Backend** – Express API, PostgreSQL integration, business logic.
- **Frontend** – React SPA with Chakra UI, hooks-based data layer.
- **Database** – PostgreSQL schema (`users`, `jobs`, `registrations`) and seed script.
- **How to run** – 1–2 commands to start everything locally.
- **Features** – Core requirements vs. implemented bonus features.
- **Common README sections** – What a typical project README would include.

---

## Backend (`/backend`)

**Tech stack & dependencies**

- **Runtime**: Node.js, Express (`express`)
- **Database**: PostgreSQL (`pg`)
- **Config & tooling**: `dotenv`, `cors`, `nodemon`
- **Validation**: `joi`
- **Auth & security**: `jsonwebtoken`

**Structure**

- `src/server.js` – Starts the HTTP server.
- `src/app.js` – Express app wiring (JSON parsing, CORS, route mounting, `/health`).
- `src/db.js` – Shared `pg` connection pool, exposes `query(text, params)`.
- `src/routes/*.routes.js` – URL → controller wiring (`/jobs`, `/users`, `/auth`).
- `src/controllers/*.controller.js` – HTTP concerns (validation, status codes, error mapping).
- `src/services/*.service.js` – Business logic + SQL (parameterized queries, `RETURNING`).
- `src/validation` – Joi schemas + helper to validate params/bodies.
- `db/init.sql` – Schema for `users`, `jobs`, `registrations`.

**Key endpoints**

- `GET /health` – Simple health check.
- `GET /jobs` – List all jobs (summaries, no registrations for performance).
- `GET /jobs/:id` – Single job + its `registrations` (emails).
- `POST /jobs` – Create a new job (requires auth, stamps `owner_user_id`).
- `POST /jobs/:id/registrations` – Register an email for a job.
- `DELETE /jobs/:id/registrations` – Job owner removes a specific registration email.
- `POST /users` – Create a user (used by auth flow).
- `POST /auth/signup` – Create user by email + optional name, return JWT + user.
- `POST /auth/login` – Login with email only, return JWT + user.

**Environment variables**

- `PORT` – HTTP port (default: 3000).
- `DATABASE_URL` – Connection string for PostgreSQL  
  e.g. `postgres://jobapp:jobapp@localhost:5432/jobapp_jobs`.
- `JWT_SECRET` – Secret for signing JWTs (required).
- `JWT_TTL` – Optional token TTL (default: `7d`).

---

## Frontend (`/frontend`)

**Tech stack & dependencies**

- **Runtime**: React 18, TypeScript, Vite
- **UI**: Chakra UI (`@chakra-ui/react`, `@chakra-ui/icons`, `@emotion/*`, `framer-motion`)
- **HTTP**: `axios`

**Structure**

- `src/main.tsx` – Mounts `<App />`, wraps in `ChakraProvider` + `AuthProvider`.
- `src/App.tsx` – Top-level layout (navbar, aside, main grid, mobile drawer).
- `src/services/api-client.ts` – Preconfigured axios client (`baseURL = http://localhost:3000`).
- `src/hooks`:
  - `useJobs` – Fetches `/jobs`, manages `jobs`, `isLoading`, `error`.
  - `useJob` – Fetches `/jobs/:id` including `registrations` on demand.
  - `useCreateJob` – Encapsulates `POST /jobs`.
  - `useRegisterForJob` – Encapsulates `POST /jobs/:id/registrations`.
  - `useDeleteRegistration` – Encapsulates `DELETE /jobs/:id/registrations`.
- `src/contexts/AuthContext.tsx` – Stores `{ user, token }`, syncs to `localStorage`, applies Bearer token to axios default headers.
- `src/components`:
  - `NavBar` – App title, search field, mobile menu toggle.
  - `JobGrid` – Uses `useJobs`, shows skeletons, errors, and `JobCard` grid; manages `JobDetailsModal` state.
  - `JobCard` / `JobCardSkeleton` – Present a concise job card or loading placeholder.
  - `JobDetailsModal` – Centered, mobile-friendly modal with full job details + registration list + register form + owner-only delete actions.
  - `CreateJobButton` – Modal form for creating new jobs (title, company, location, description).
  - `AuthButton` / `LogoutButton` – Simple signup/login modal and logout actions.
  - `ColorModeSwitch` – Light/dark mode toggle in the mobile drawer.

---

## Features

### Required features from the requirements (implemented)

- **Create Job Posts**
  - Modal form with:
    - **Job Title** (required)
    - **Company Name** (required)
    - **Location** (optional)
    - **Description** (optional, multi-line)
  - On submit, the frontend calls `POST /jobs` and the backend stores the new job in PostgreSQL.
- **View All Job Posts**
  - `JobGrid` renders all jobs from `GET /jobs` as a responsive grid of cards.
  - Clicking a job card opens `JobDetailsModal` with full information.
- **Register to a Job**
  - Inside `JobDetailsModal`, users can submit an **email address** via a simple form.
  - The backend stores registrations in the `registrations` table (`POST /jobs/:id/registrations`).
- **Job details page/modal**
  - Shows:
    - Job title, company, location, description.
    - Human-readable "Posted" label (just now / minutes / hours / date).
    - **List of registration emails** already registered for that job.
    - Email form to register a new email address.
- **Backend API according to spec**
  - `GET /jobs`, `POST /jobs`, `POST /jobs/:id/registrations` (aligned with the described endpoints).

### Bonus / extra features beyond the requirements

- **Users entity + lightweight auth**
  - `users` table and `/users` endpoint.
  - `/auth/signup` and `/auth/login` issue JWTs; no passwords to keep the flow simple.
  - `AuthContext` on the frontend stores `{ user, token }` and keeps the token in `localStorage`.
  - **Job ownership**: `POST /jobs` requires auth and stamps `owner_user_id`.
- **Owner-only registration management**
  - Backend: `DELETE /jobs/:id/registrations` validates that the caller owns the job.
  - Frontend: job owners see a small trash icon next to each email and can remove registrations inline.
- **Filters / search**
  - `JobGrid` supports **keyword search** across title, company, location, and description via a search input in the navbar.
- **Loading & error states**
  - Chakra `Spinner` and `JobCardSkeleton` components for loading states.
  - Clear error messages rendered when requests fail (e.g. duplicate registration, network issues).
- **More advanced application logic**
  - Email validation on the client before sending registration.
  - Duplicate registration prevention via a unique DB constraint and friendly error message.
  - Humanized "posted" timestamps.
- **UI/UX polish**
  - Responsive layout with aside column on desktop and a full-screen drawer on mobile.
  - Dark/light mode support via Chakra UI.
  - Centered, width-capped details modal tailored for small screens.

---

## How to run everything locally

### Prerequisites

- Node.js (LTS) + npm
- Docker (for PostgreSQL)

### 1. Start PostgreSQL (Docker)

You can run the database in a local Docker container:

```bash
docker run --name jobapp-postgres -e POSTGRES_USER=jobapp -e POSTGRES_PASSWORD=jobapp -e POSTGRES_DB=jobapp_jobs -p 5432:5432 -d postgres:16
```

Then, from `/backend`, apply the schema:

```bash
cd backend
psql "$DATABASE_URL" -f db/init.sql
```

Make sure `DATABASE_URL` in your environment matches the container (for example: `postgres://jobapp:jobapp@localhost:5432/jobapp_jobs`).

### 2. Install dependencies

```bash
cd backend && npm install
cd ../frontend && npm install
```

### 3. Run backend and frontend (1–2 commands)

In two terminals:

```bash
cd backend && npm run dev
```

```bash
cd frontend && npm run dev
```

This matches the Project requirement of “simple (1–2 lines of commands)”:

- One command to start the backend (`npm run dev` in `/backend`).
- One command to start the frontend (`npm run dev` in `/frontend`).

If you prefer a single command, you can also use a top-level helper script (for example in your own environment) that runs both scripts concurrently.

The frontend expects the backend at `http://localhost:3000` (see `frontend/src/services/api-client.ts`).

---

## Running everything with Docker (single command)

If you prefer to run the entire stack via Docker, you can use the included `docker-compose.yml`.

### Start DB + backend + frontend

From the project root:

```bash
docker compose up --build
```

This will:

- Start **PostgreSQL** in a container named `jobapp-postgres`.
- Build and run the **backend** container on port `3000`.
- Build and run the **frontend** container on port `5173`.

Then open the app in your browser at:

- `http://localhost:5173`

The backend is available at:

- `http://localhost:3000`

### Optional: seeding the database when using Docker

Seeding is **not automatic** so you can decide when to load sample data.

After `docker compose up` has started the containers, run:

```bash
docker compose exec db psql "postgres://jobapp:jobapp@localhost:5432/jobapp_jobs" -f /docker-entrypoint-initdb.d/01-init.sql
docker compose exec db psql "postgres://jobapp:jobapp@localhost:5432/jobapp_jobs" -f /app/backend/db/seed.sql
```

Alternatively, from your host (with `psql` installed) you can run:

```bash
cd backend
psql "$DATABASE_URL" -f db/init.sql
psql "$DATABASE_URL" -f db/seed.sql
```

Both approaches keep seeding as an explicit, optional step.

---

## Database seed script

The project uses a simple SQL-based seeding approach so you can quickly load meaningful demo data.

### Seed file location

- `backend/db/seed.sql` (you can generate or update this file from a running database).

### How to populate the database from `seed.sql`

From `/backend`:

```bash
psql "$DATABASE_URL" -f db/seed.sql
```

This will insert the sample users, jobs, and registrations defined in `seed.sql` into the existing schema from `db/init.sql`.

### How to capture your **current** database contents into `seed.sql`

If you already have interesting data in your local Docker PostgreSQL instance and want to turn that into a reproducible seed:

1. From your host (with Docker running), create a data-only dump:

   ```bash
   pg_dump \
     --data-only \
     --inserts \
     --no-owner \
     --no-privileges \
     "$DATABASE_URL" \
     -t users -t jobs -t registrations \
     > backend/db/seed.sql
   ```

2. Commit `backend/db/seed.sql` to the repo.  
   Review it to ensure it contains only anonymized or safe sample data.

3. Anyone reviewing the project can now run:

   ```bash
   cd backend
   psql "$DATABASE_URL" -f db/init.sql
   psql "$DATABASE_URL" -f db/seed.sql
   ```

This approach keeps the seed script in sync with your “real” development data while remaining a simple, explicit SQL file.

---

## Design and technical decisions (high level)

- **PostgreSQL instead of in-memory storage** – Closer to real-world systems and showcases SQL schema design (`users`, `jobs`, `registrations`).
- **Layered backend** – Routes → controllers → services → `db.js` keeps responsibilities clean and makes it easy to extend with more endpoints.
- **Hooks-based frontend** – Custom React hooks encapsulate data fetching and side effects; components stay focused on UI.
- **Chakra UI** – Provides accessible, responsive building blocks with minimal custom CSS, ideal for fast iteration on UI.
- **Lightweight auth** – Email-only signup/login with JWTs to support job ownership and owner-only actions without overcomplicating the Project.
