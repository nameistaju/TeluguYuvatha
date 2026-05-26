# Telugu Yuvatha Commerce Platform

Production ecommerce platform for Telugu Yuvatha, a premium Telugu streetwear brand.

## Architecture

- `client/` - Next.js 15 storefront.
- `admin/` - Next.js 15 admin dashboard.
- `optional-api/` - Node.js + Express API for auth, catalogue, carts, orders, payments, uploads, and admin workflows.
- `shared/` - Shared TypeScript models and seed catalogue.
- PostgreSQL is the primary database.
- Prisma ORM owns schema, migrations, seed data, and database access.
- Razorpay handles payments, Cloudinary handles image hosting, and JWT handles authentication.

## Quick Start

```bash
npm install
cp admin/.env.example admin/.env.local
cp optional-api/.env.example optional-api/.env
npm run db:generate --workspace optional-api
npm run db:migrate --workspace optional-api
npm run db:seed --workspace optional-api
npm run dev:api
npm run dev:admin
```

The API runs on `http://localhost:5000/api`.
The admin dashboard runs on `http://localhost:3001`.
The storefront runs from `client/` on `http://localhost:3000`.

## Environment

API:

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/telugu_yuvatha?schema=public
PORT=5000
JWT_SECRET=change_this_to_a_long_random_secret
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM=
FRONTEND_URL=http://localhost:3000
ADMIN_URL=http://localhost:3001
```

Admin:

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Client:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_RAZORPAY_KEY_ID=
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
```

## Development Notes

- Legacy browser-cloud dependencies, auth flows, environment variables, storage, and AI integrations have been removed.
- Prisma schema lives at `optional-api/prisma/schema.prisma`.
- Prisma migrations live under `optional-api/prisma/migrations/`.
- The API requires `DATABASE_URL` in every environment.

## Deployment

Deploy `client/` and `admin/` to a Next.js host such as Vercel. Deploy `optional-api/` to a Node-compatible host such as Render, Railway, Fly.io, or a VPS. Set `DATABASE_URL` and all service secrets, run Prisma migrations, and configure CORS origins with `FRONTEND_URL` and `ADMIN_URL`.

Run `npm run build` before deployment to verify shared models, API TypeScript, and admin production compilation.
