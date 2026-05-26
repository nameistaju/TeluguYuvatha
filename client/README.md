# Telugu Yuvatha Client

Next.js 15 storefront for Telugu Yuvatha.

## Getting Started

```bash
npm install
cp client/.env.example client/.env.local
npm run dev --workspace client
```

Open [http://localhost:3000](http://localhost:3000).

## Environment

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_RAZORPAY_KEY_ID=
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
```

The storefront uses the PostgreSQL-backed Express API for ecommerce data and Razorpay for checkout.

## Deployment

Deploy as a standard Next.js app and point `NEXT_PUBLIC_API_URL` at the deployed API.
