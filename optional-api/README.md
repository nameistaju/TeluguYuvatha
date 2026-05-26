# Telugu Yuvatha API

Node.js + Express API for Telugu Yuvatha ecommerce workflows: JWT auth, product/admin CRUD, carts, wishlists, orders, Razorpay payments, Cloudinary uploads, contacts, newsletter, analytics, and site settings.

## Install

```bash
npm install
cp optional-api/.env.example optional-api/.env
npm run db:generate --workspace optional-api
npm run db:migrate --workspace optional-api
npm run db:seed --workspace optional-api
npm run dev:api
```

## Database

PostgreSQL is required in all environments through `DATABASE_URL`.

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/telugu_yuvatha?schema=public
```

Prisma files:

- `prisma/schema.prisma` - models and relations.
- `prisma/migrations/` - SQL migrations.
- `prisma/seed.ts` - seed catalogue and settings.

Useful commands:

```bash
npm run db:generate --workspace optional-api
npm run db:migrate --workspace optional-api
npm run db:seed --workspace optional-api
```

## Stored Entities

- User
- Product
- Category
- Collection
- Cart and CartItem
- Wishlist and WishlistItem
- Order and OrderItem
- Review
- Address
- NewsletterSubscriber
- ContactMessage
- SiteSetting

## Routes

- `/api/auth`
- `/api/products`
- `/api/categories`
- `/api/collections`
- `/api/cart`
- `/api/wishlist`
- `/api/orders`
- `/api/payments`
- `/api/reviews`
- `/api/contact`
- `/api/newsletter`
- `/api/admin`
- `/api/settings`
- `/api/uploads`

## Deployment

Deploy on any Node host. Set `DATABASE_URL`, JWT, Razorpay, Cloudinary, SMTP, `FRONTEND_URL`, and `ADMIN_URL`. Run Prisma migrations before starting the API.

All persistence runs through PostgreSQL and Prisma.
