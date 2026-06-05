# ac-back

NestJS backend for the AC cleaning app.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env` from `.env.example` and set your existing PostgreSQL database URL:

```env
PORT=4000
DATABASE_URL=postgres://user:password@localhost:5432/ac_cleaning
FRONTEND_ORIGIN=http://localhost:3000,http://localhost:3001
```

3. Start the backend:

```bash
npm run start:dev
```

## Routes

- `GET /health`
- `POST /auth/login`
- `POST /auth/register`
- `GET /services`
- `GET /time-slots`
- `GET /countries`
- `GET /bookings`
- `GET /bookings?status=confirmed&date=2026-06-05`
- `GET /bookings/user/:userId`
- `GET /bookings/:id`
- `POST /bookings`
- `PATCH /bookings/:id/status`

The TypeORM config uses `synchronize: false`, so it will not rewrite your existing database schema.
