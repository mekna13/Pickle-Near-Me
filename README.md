# Pickle – Rental Marketplace (Next.js)

A small prototype for **Pickle**, a rental marketplace that helps users find nearby rental “closets” and pickleball gear. The frontend is built with **Next.js**; the backend is **AWS serverless** (API Gateway → Lambda → DynamoDB). Images are served via a CDN.

---

## Table of Contents

* [Overview](#overview)
* [Architecture](#architecture)
* [Data Model](#data-model)
* [API](#api)
* [Getting Started](#getting-started)
* [Environment Variables](#environment-variables)
* [Local Development](#local-development)
* [Deployment](#deployment)
* [Security & Privacy](#security--privacy)
* [CORS & Error Handling](#cors--error-handling)
* [Testing the API](#testing-the-api)
* [Roadmap](#roadmap)
* [License](#license)

---

## Overview

**Goal:** Let users discover the closest rental locations ("closets") by city or by current GPS position.

**Tech Highlights**

* **Frontend:** Next.js (App Router), React, Tailwind (optional), client-side maps.
* **Backend:** AWS API Gateway + Lambda (Python/Node) + DynamoDB (`Rentals` table).
* **Data:** City-scoped items keyed by `pk = CITY#<id>` and `sk = CLOSET#<closet_id>`.
* **CDN:** Product/location images served via CloudFront-style URLs.

---

## Architecture

```
Next.js (Vercel/Node)
     ↓ HTTPS (fetch)
API Gateway  (REST/HTTP API)
     ↓
Lambda (GET/POST handlers)
     ↓
DynamoDB  (Rentals table)
```

### Frontend (Next.js)

* Pages/components fetch data from the serverless API using `NEXT_PUBLIC_API_BASE_URL`.
* Supports two discovery modes: **by city** and **by proximity** (based on user `lat/lng`).

### Backend (AWS Serverless)

* **API Gateway**: public endpoints `/closets` and `/nearest`.
* **Lambdas**:

  * `GET /closets?cityId=<city>` – list closets for a given city.
  * `POST /nearest` – request body `{ lat, lng }`, returns nearby closets (and optionally the closest city).
* **DynamoDB**: single table `Rentals` with items representing closets and related metadata.

---

## Data Model

**Table:** `Rentals`

**Primary Keys**

* `pk` (Partition Key): `CITY#<city_slug>` (e.g., `CITY#sf`)
* `sk` (Sort Key): `CLOSET#<closet_id>` (e.g., `CLOSET#sf_clo_0001`)

**Attributes (example)**

```json
{
  "pk": "CITY#sf",
  "sk": "CLOSET#sf_clo_0001",
  "closetId": "sf_clo_0001",
  "cityId": "sf",
  "name": "Lucy Lies",
  "rentalRate": 50,
  "lat": 37.773864,
  "lng": -122.420972,
  "image_url": "https://dnlc2p0nyuqvz.cloudfront.net/productImages%2Fb9d...",
  "rating": 4.8
}
```

> **Optional Indexing**: If you need cross-city queries (e.g., top-rated across all cities), consider a GSI with `GSI1PK = TYPE#CLOSET` and `GSI1SK = rating` or similar. Not required for basic city-scoped queries.

---

## API

> Replace `https://api.example.com` with your actual API Gateway base URL or a local proxy.

### `GET /closets`

List closets in a city.

**Query Params**

* `cityId` (required): e.g., `sf`, `nyc`. (Backed by `pk = CITY#<cityId>`)

**Response** `200 OK`

```json
{
  "items": [
    {
      "closetId": "sf_clo_0001",
      "name": "Lucy Lies",
      "rentalRate": 50,
      "lat": 37.773864,
      "lng": -122.420972,
      "image_url": "...",
      "rating": 4.8
    }
  ]
}
```

**Errors**

* `400` if `cityId` missing.
* `500` for unhandled exceptions.

### `POST /nearest`

Return closets near a user location (and optionally the closest city).

**Body**

```json
{ "lat": 37.77, "lng": -122.42, "limit": 10 }
```

* `lat`, `lng` are required.
* `limit` (optional, default 10) caps results.

**Response** `200 OK`

```json
{
  "closestCity": "sf",
  "items": [
    { "closetId": "sf_clo_0001", "distanceKm": 0.42, "name": "Lucy Lies", "lat": 37.773864, "lng": -122.420972, "rentalRate": 50, "image_url": "...", "rating": 4.8 }
  ]
}
```

**Errors**

* `400` if `lat/lng` invalid or missing.
* `500` for unhandled exceptions.

---

## Getting Started

### Prerequisites

* **Node.js** LTS (e.g., 18+)
* **npm** or **pnpm**
* **AWS account** (for the backend)
* (Optional) **AWS CLI** configured and IAM permissions to deploy Lambdas/APIs.

### Install & Run (Frontend)

```bash
# 1) Install deps
npm install

# 2) Add env vars (see below)
cp .env.local.example .env.local
# Edit .env.local

# 3) Dev server
npm run dev
# App at http://localhost:3000
```

---

## Environment Variables

Create `.env.local` in the Next.js root:

```
NEXT_PUBLIC_API_BASE_URL=https://api.example.com
# If needed for maps or analytics
NEXT_PUBLIC_MAPBOX_TOKEN=...
```

Use `NEXT_PUBLIC_*` for values needed in the browser. Server-only secrets should **not** be exposed on the client.

---

## Local Development

* The app fetches from `NEXT_PUBLIC_API_BASE_URL`. For local testing, you can run a local server or set up an API Gateway stage.
* Consider adding a simple proxy route in Next.js (e.g., `/api/*`) that forwards to the AWS API to avoid CORS during development.

---

## Deployment

### Frontend (Next.js)

* Deploy on **Vercel** or any Node host.
* Set environment variables in the hosting provider.

### Backend (AWS)

* Create **API Gateway** routes `/closets` (GET) and `/nearest` (POST) → integrate with Lambda functions.
* Give Lambdas permission to read from DynamoDB `Rentals`.
* Ensure **CORS** is enabled on API Gateway or handled in Lambda responses.
* If using IaC, you can use **Serverless Framework**, **SAM**, or **CloudFormation**. Example Serverless snippet:

```yaml
functions:
  getClosets:
    handler: handler.getClosets
    events:
      - http:
          path: closets
          method: get
          cors: true
  nearest:
    handler: handler.nearest
    events:
      - http:
          path: nearest
          method: post
          cors: true
```

---

## Security & Privacy

* Always serve the app and API over **HTTPS**.
* For proximity search, send `lat/lng` in **POST body**, not query params.
* Validate and sanitize all inputs server-side. Rate-limit if the API is public.
* Do not include secrets in `NEXT_PUBLIC_*` variables.

---

## CORS & Error Handling

* **CORS headers** (example):

```json
{
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
}
```

* Handle `OPTIONS` preflight in Lambda by returning `204` with the headers above.
* **API Gateway “Missing Authentication Token”** often means one of:

  1. Wrong **path** or **method** (e.g., calling `/nearest/` with a trailing slash, or using GET instead of POST).
  2. Wrong **stage** URL.
  3. Lambda not integrated or deployment not updated.

---

## Testing the API

* Use **Postman** or **Thunder Client**.
* Sample calls:

  * `GET https://api.example.com/closets?cityId=sf`
  * `POST https://api.example.com/nearest` with body `{ "lat": 37.77, "lng": -122.42 }`

---

## Roadmap

* Add map view with clustered markers.
* Add auth (AWS Cognito) for owner-only admin routes.
* Add geospatial index or precomputed city boundaries.
* Add reviews, availability, bookings, and payments.
* Observability: CloudWatch logs, metrics, and structured tracing.

---

## License

Proprietary – for internal prototyping and evaluation only.
