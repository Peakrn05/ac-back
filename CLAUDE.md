# CLAUDE.md

## Project

This repository is the backend for the AC cleaning booking app. All backend code must be written in NestJS with TypeScript.

## Stack

- NestJS
- TypeScript
- TypeORM
- PostgreSQL
- class-validator DTO validation

## Important Rules

- Do not switch this backend to Express-only JavaScript, Python, PHP, or another framework.
- Keep code under `src/` organized by NestJS modules.
- Use DTO classes for request bodies.
- Use TypeORM entities for database tables.
- Keep `synchronize: false` because the project uses an existing database.
- Never hard-code real database credentials. Use `.env`.
- Do not store card numbers, CVV, or raw payment card details.
- New passwords should be hashed. Existing plain demo passwords are only supported for compatibility.

## Environment

Use either:

```env
DATABASE_URL=postgres://user:password@localhost:5432/ac_cleaning
```

Or:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=ac_cleaning
```

Optional:

```env
PORT=4000
FRONTEND_ORIGIN=http://localhost:3000,http://localhost:3001
DATABASE_SSL=false
```

## Commands

```bash
npm install
npm run build
npm run typecheck
npm run lint
npm run start:dev
```

## API Surface

- `GET /health`
- `POST /auth/login`
- `POST /auth/register`
- `GET /services`
- `GET /time-slots`
- `GET /countries`
- `GET /bookings`
- `GET /bookings/user/:userId`
- `GET /bookings/:id`
- `POST /bookings`
- `PATCH /bookings/:id/status`
- `PATCH /bookings/:id/schedule`

## Database Notes

Entity mappings expect these core tables:

- `users`
- `services`
- `service_ratings`
- `time_slots`
- `countries`
- `bookings`
- `payments`

If the existing database uses different table or column names, update the TypeORM entity decorators instead of changing frontend contracts.

BTU pricing is currently calculated from request data and persisted through `total_amount`. The BTU value is stored in notes for compatibility with the existing database schema, so do not add a required `btu` entity column unless the database is migrated first.
