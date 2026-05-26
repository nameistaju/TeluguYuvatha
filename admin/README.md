# Telugu Yuvatha Admin

Next.js 15 admin dashboard for managing Telugu Yuvatha ecommerce operations.

## Install

```bash
npm install
cp admin/.env.example admin/.env.local
npm run dev:admin
```

Open `http://localhost:3001`.

## Features

- JWT admin login through the Express API.
- Dashboard analytics with revenue, orders, customers, best sellers, and low stock alerts.
- Product, category, and collection management.
- Inventory and order status controls.
- Customers, newsletter subscribers, contact messages, and site settings.
- Cloudinary-backed image upload through the API.

## Environment

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_API_URL=https://your-api.example.com/api
```

Admin data comes from the PostgreSQL-backed Express API.
