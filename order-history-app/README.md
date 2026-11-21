# Brighton Order History — Node.js

Express API that combines Shopify and Retail POS orders into PostgreSQL and returns only the signed-in customer's orders.

## Requirements
- Node.js 20+
- PostgreSQL
- Shopify custom app with Admin API access and App Proxy configured

## Install and run
1. `.env` needs working credentials.
2. `npm install`
3. `npm run db:generate`
4. `npm run db:migrate dev --name init`
5. Terminal 1: `npm run dev`
6. Terminal 2: `npm run worker:init`

## POS client
- Mapping will need review and confirmation.
- Update environment variables with active credentials for functional use and testing.

## Shopify client
- Mapping will need review and confirmation.
- Update environment variables with active credentials for functional use and testing.

## Endpoints
- `GET /api/proxy/orders` (Shopify App Proxy)
- `GET /api/orders?page=1&limit=20`
- `GET /api/orders/:id`
- `POST /api/webhooks/shopify/orders`
- `GET /api/health`
