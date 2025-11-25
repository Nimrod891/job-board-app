# Backend Architecture

## Overview

The backend is a small Node.js + Express API that exposes job-related endpoints for a simple job board application. Data is stored in PostgreSQL (not in memory), so it is persistent and closer to a real production setup.

The main responsibilities are:

- Manage job postings (create and list jobs)
- Allow clients to view the details of a job
- Allow clients to register their email for a job
- Provide a clean, extendable structure for future bonus features (users, ownership, applying with more candidate info, removing registrations, etc.)

## Tech Stack

- **Node.js + Express** – HTTP API framework
- **PostgreSQL** – persistent data storage
- **pg** – PostgreSQL driver for Node.js
- **dotenv** – environment variable management
- **cors** – CORS handling for frontend integration
- **Docker** – runs PostgreSQL locally in a container (for simple setup)
- **WSL** – Linux-like development environment on Windows

## Data Model

### users

Represents a user in the system (e.g. job poster, admin, or future authenticated user).

- `id` (UUID, primary key)
- `email` (TEXT, unique, required)
- `name` (TEXT, optional)
- `role` (TEXT, default `'user'`, e.g. `'user'`, `'admin'`, `'recruiter'`)
- `created_at` (TIMESTAMP, default `NOW()`)

In the initial version, users are not fully exposed via the API, but the table exists to support future features and ownership.

### jobs

Represents a job posting.

- `id` (UUID, primary key)
- `title` (TEXT, required)
- `company` (TEXT, required)
- `location` (TEXT, optional)
- `description` (TEXT, optional)
- `owner_user_id` (UUID, optional, foreign key to `users.id`)
- `created_at` (TIMESTAMP, default `NOW()`)

For the MVP, `owner_user_id` can be `NULL` and is not yet enforced in logic. It is there to support bonus features such as “jobs owned by a specific user” or permission checks for managing registrations.

### registrations

Represents a registration / application to a specific job.

- `id` (UUID, primary key)
- `job_id` (UUID, required, foreign key to `jobs.id`, `ON DELETE CASCADE`)
- `email` (TEXT, required)
- `created_at` (TIMESTAMP, default `NOW()`)
- Unique constraint on `(job_id, email)` to prevent duplicate registrations for the same job.

In later iterations, this table can be extended with additional candidate fields (e.g. `candidate_name`, `candidate_phone`) or a `user_id` foreign key if the applicant must be a registered user.

## Layered Design

The backend is organized into clear layers under `src/`:

- `src/app.js`  
  Express app configuration (middleware, CORS, JSON parsing, route mounting).

- `src/server.js`  
  Entry point that starts the HTTP server and listens on the configured port.

- `src/db.js`  
  Database helper that exposes a shared pg connection pool and a simple `query` function.

- `src/routes/*.routes.js`  
  Route definitions (URLs and HTTP methods).

- `src/controllers/*.controller.js`  
  HTTP-level logic (reading `req`, performing validation, choosing status codes, sending JSON responses). Controllers do not contain SQL.

- `src/services/*.service.js`  
  Business logic and database queries (calls into `db.query`). Services do not deal with Express request/response objects.

This structure keeps concerns separated:

- Routes know about paths and HTTP verbs.
- Controllers know about HTTP semantics and validation.
- Services know about data and SQL.
- `db.js` owns the database connection details.

It also makes the code easier to extend and test.

## API Endpoints (Initial Version)

Initial endpoints implemented in the MVP:

- `GET /health`  
  - Health check endpoint to verify the backend is running.

- `GET /jobs`  
  - Returns a list of all jobs.  
  - Response: array of job objects (without registrations).

- `GET /jobs/:id`  
  - Returns a single job and its registrations (emails).  
  - Response: job object with a `registrations` array.

- `POST /jobs`  
  - Creates a new job.  
  - Request body:  
    `{ "title": string, "company": string, "location"?: string, "description"?: string }`  
  - Response: created job object.

- `POST /jobs/:id/registrations`  
  - Adds a registration email for the given job.  
  - Request body: `{ "email": string }`  
  - Response: `{ "success": true }` or an error.

Planned / bonus endpoints (not required for the first version but supported by the design):

- `DELETE /jobs/:jobId/registrations/:registrationId` – remove a registration.
- `GET /jobs?location=...&q=...` – filtering and searching.
- Pagination for `/jobs`.
- User-related endpoints (e.g. `POST /users`, `GET /users/:id`) and ownership-based views.

## Error Handling & Validation

Controllers are responsible for basic input validation and translating errors into HTTP status codes:

- Missing required fields (e.g. title, company, email) → `400 Bad Request`.
- Job not found → `404 Not Found`.
- Duplicate registration for the same job (unique constraint violation) → `409 Conflict`.
- Unexpected errors (e.g. database errors) → `500 Internal Server Error`.

Errors are logged to the server console for debugging. Error responses are simple JSON objects, so the frontend can display clear messages.

## Running Locally

The backend expects the following environment variables (via `.env`):

- `PORT` – port to run the HTTP server on (default: 3000).
- `DATABASE_URL` – PostgreSQL connection string  
  (e.g. `postgres://jobapp:jobapp@localhost:5432/jobapp_jobs`).

In development, PostgreSQL is typically run via a Docker container, and the Node.js backend runs in WSL. Postman on Windows can call the backend through `http://localhost:<PORT>`.

## Extensibility

This architecture is intentionally simple but provides clear extension points:

- New routes/controllers/services can be added for bonus features (users, authentication, more job fields, filtering, etc.).
- Additional tables (e.g. `users`, `job_owners`, more detailed candidate info) can be added to PostgreSQL without changing the basic API pattern.
- The services layer can be unit-tested independently of Express.
- Later, the backend can be containerized, and the same `DATABASE_URL` pattern will work in production.
