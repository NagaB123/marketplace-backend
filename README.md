# Fake Store Backend

A Node.js and TypeScript API that exposes Fake Store authentication and catalog data, plus a local enquiry submission endpoint.

## Setup progress

- [x] Created the TypeScript/Express project structure.
- [x] Added environment-based server, upstream API, timeout, and database configuration.
- [x] Added Fake Store API proxy routes for login and products.
- [x] Added category listing/filtering and product search routes.
- [x] Added SQLite-backed enquiry submission.
- [x] Install dependencies and verify the build and health endpoint.

## Requirements

- Node.js 22 or newer
- npm

## Run locally

From this directory:

```sh
npm install
cp .env.example .env
npm run dev
```

The service listens on `http://localhost:8080` by default. Change `.env` to override the port and other settings. The SQLite database is created automatically at the configured `DATABASE_FILE` path.

For a production build, run `npm run build` followed by `npm start`.

## Configuration

| Variable | Purpose | Default |
| --- | --- | --- |
| `NODE_ENV` | Runtime environment | `development` |
| `PORT` | HTTP port | `8080` |
| `FAKE_STORE_API_BASE_URL` | Fake Store API origin | `https://fakestoreapi.com` |
| `UPSTREAM_TIMEOUT_MS` | Upstream request timeout | `10000` |
| `DATABASE_FILE` | SQLite database location | `./data/enquiries.sqlite` |

Copy `.env.example` to `.env` before running. `.env` is ignored by git.

## API

| Method | Route | Description |
| --- | --- | --- |
| `POST` | `/api/auth/login` | Proxies `{ "username": "...", "password": "..." }` to Fake Store login. |
| `GET` | `/api/products` | Product listing; accepts upstream `limit` and `sort` query parameters. |
| `GET` | `/api/products/:id` | Product details by ID. |
| `GET` | `/api/categories` | Lists available categories. |
| `GET` | `/api/products/categories` | Lists available categories. |
| `GET` | `/api/products/category/:category` | Lists products in one category. |
| `GET` | `/api/products/search?q=term` | Searches product title, description, and category. |
| `POST` | `/api/enquiries` | Stores `{ "name": "...", "email": "...", "message": "...", "productId": 1 }` locally. `productId` is optional. |
| `GET` | `/health` | Health check. |

The API routes are defined in `src/routes/apiRoutes.ts`; request handling and validation are in `src/controllers/apiController.ts`. For example:

```sh
curl -X POST http://localhost:8080/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"username":"johnd","password":"m38rmF$"}'

curl 'http://localhost:8080/api/products/1'
curl 'http://localhost:8080/api/products/search?q=shirt'
curl -X POST http://localhost:8080/api/enquiries \
  -H 'Content-Type: application/json' \
  -d '{"name":"Jane Doe","email":"jane@example.com","message":"Please contact me"}'
```

Search is performed by fetching the Fake Store product list and filtering it in this backend because the upstream API does not provide a search endpoint. Enquiries are stored in SQLite and are not sent to Fake Store.

## AWS note

No cloud infrastructure is provisioned. The service runs locally with SQLite. For an AWS deployment, use an AWS-managed database such as RDS/Aurora instead of a local SQLite file and provide its connection settings through environment configuration.