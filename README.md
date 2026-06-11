# Arth Dashboard — Backend API

A production-grade REST API for a Dashboard application built with Express, TypeScript, MySQL, and Redis.

## Prerequisites

- **Node.js** v18+ (LTS)
- **Docker** & **Docker Compose** (for MySQL + Redis)
- **npm** v9+

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start MySQL & Redis
docker-compose up -d

# 3. Copy env file (already configured for docker-compose defaults)
cp .env.example .env

# 4. Run migrations
npm run migrate

# 5. Seed demo data
npm run seed

# 6. Start dev server
npm run dev
```

The API will be available at `http://localhost:3000`.

### Demo Credentials

| Email              | Password    |
|--------------------|-------------|
| demo@example.com   | Demo@1234   |
| jane@example.com   | Jane@1234   |

## Scripts

| Command             | Description                          |
|---------------------|--------------------------------------|
| `npm run dev`       | Start dev server with hot reload     |
| `npm run build`     | Compile TypeScript to `dist/`        |
| `npm start`         | Run compiled production server       |
| `npm run migrate`   | Run Sequelize migrations             |
| `npm run migrate:undo` | Revert all migrations             |
| `npm run seed`      | Seed demo users & transactions       |
| `npm test`          | Run all tests                        |
| `npm run lint`      | Run ESLint                           |
| `npm run format`    | Format code with Prettier            |

## Running Tests

Tests require MySQL and Redis running (via docker-compose). They use a separate `arth_dashboard_test` database.

```bash
docker-compose up -d
npm test
```

## API Endpoints

All endpoints are prefixed with `/api/v1`.

| Method | Endpoint          | Auth | Description                              |
|--------|-------------------|------|------------------------------------------|
| GET    | /health           | No   | Health check                             |
| POST   | /auth/register    | No   | Register a new user                      |
| POST   | /auth/login       | No   | Login and receive JWT                    |
| POST   | /auth/logout      | Yes  | Logout (revoke session)                  |
| GET    | /dashboard        | Yes  | User profile + spend/income statistics   |
| GET    | /transactions     | Yes  | Paginated transaction list               |

### Response Envelope

All responses follow a consistent format:

```json
// Success
{ "success": true, "data": { ... }, "message": "..." }

// Error
{ "success": false, "error": { "code": "ERROR_CODE", "message": "...", "details": [...] } }
```

### Pagination (GET /transactions)

Query params: `page` (default: 1), `limit` (default: 10, max: 50)

Response includes:
```json
{
  "items": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalItems": 45,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## Architecture Decisions

### Why Redis sessions on top of JWT?

JWTs are stateless — once issued, they cannot be revoked until they expire. By storing a session key in Redis (`session:<userId>:<jti>`) with a TTL matching the token's expiry, we get the best of both worlds: JWT provides tamper-proof, self-contained authentication, while Redis provides instant revocation on logout. The auth middleware checks both layers: JWT signature/expiry first, then Redis session existence.

### Why a layered architecture?

Routes → Controllers → Services → Models enforces clear separation of concerns. Controllers handle HTTP (request parsing, response formatting), services contain business logic (can be reused or tested independently), and models manage data access. This makes the codebase navigable for reviewers and testable at each layer.

### Why field-level validation errors?

Password validation returns specific messages for each failed rule (missing uppercase, missing number, etc.) rather than a generic "password too weak" message. This enables the frontend to show inline field-level feedback, reducing user frustration during registration.

## Project Structure

```
src/
  config/         — env validation, DB/Redis connections
  models/         — Sequelize models + associations
  migrations/     — database migrations
  seeders/        — demo data
  middlewares/    — auth, rate limiter, error handler, request validator
  modules/
    auth/         — register, login, logout
    dashboard/    — aggregated stats
    transactions/ — paginated listing
  utils/          — ApiError, ApiResponse, asyncHandler, logger
  app.ts          — Express app assembly
  server.ts       — bootstrap (connect DB/Redis, listen)
tests/
  unit/           — schema validation, JWT, pagination
  integration/    — full endpoint tests with supertest
```
