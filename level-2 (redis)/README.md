# Redis: Cache-Aside Pattern, API Rate Limiting, OTP Expiration & BullMQ

Implementing practical backend engineering concepts using Redis, Node.js, Express, MongoDB, and BullMQ, including cache-aside caching, API rate limiting, OTP generation with automatic expiration, and asynchronous job processing.

## Tech Stack

- **Runtime:** Node.js
- **Backend:** Express.js
- **Database:** MongoDB
- **Caching & Temporary Storage:** Redis
- **Redis Client:** ioredis
- **Job Queue:** BullMQ
- **Containerization:** Docker & Docker Compose

## Features

### 1. Redis Caching

- Implemented the cache-aside pattern using Redis and MongoDB.
- Return cached data directly on a cache hit.
- Fetch data from MongoDB on a cache miss and store it in Redis.
- Compare direct MongoDB reads with Redis-backed reads.

### 2. API Rate Limiting

- Restrict the number of requests a client can make within a configured limit.
- Reject excessive requests to help protect backend endpoints.
- Explore request throttling and API resource management.

### 3. OTP Generation & Expiration

- Generate OTPs for verification workflows.
- Store OTPs in Redis with a 30-second time-to-live (TTL).
- Automatically expire OTP entries after the configured duration.

### 4. Asynchronous Job Queues with BullMQ

- Create and enqueue background jobs using BullMQ.
- Use Redis as the queue's backing store.
- Process queued jobs asynchronously using workers.
- Separate job processing from the main HTTP request flow.

### 5. Docker Compose

- Manage supporting services through Docker Compose.
- Configure and run backend dependencies locally.
- Simplify local development and service startup.

## Architecture
```
flowchart TD
    A[Client] --> B[Express Backend]

    B --> C[Redis Caching]
    C -->|Cache Hit| D[Return Cached Data]
    C -->|Cache Miss| E[(MongoDB)]
    E --> F[Store Result in Redis]

    B --> G[Rate Limiting]
    B --> H[OTP Generation]
    H --> I[(Redis - 30s TTL)]

    B --> J[BullMQ Queue]
    J --> K[(Redis)]
    K --> L[Background Worker]
```

## Getting Started

### Prerequisites

- Node.js and npm
- Docker Desktop
- A MongoDB connection string

### 1. Install dependencies
```
npm install
```

### 2. Configure environment variables

Create a `.env` file using `.env.example`:
```
PORT=8000
MONGODB_URI=your_mongodb_connection_string
REDIS_URL=redis://localhost:6379
```

Update the MongoDB connection string and ensure the Redis URL matches your environment.

### 3. Start supporting services
```
docker compose up
```

### 4. Start the backend
```
npm run dev
```

Use the scripts configured in `package.json`.

## Key Concepts Learned

- Cache-aside pattern and cache hits versus cache misses.
- Redis-based temporary storage and TTL expiration.
- API rate limiting and request control.
- Asynchronous processing using BullMQ queues and workers.
- Integration of MongoDB, Redis, and Express.
- Containerized development with Docker Compose.

## Learning Goal

Build a stronger understanding of backend engineering by implementing practical mechanisms for caching, request control, temporary data management, asynchronous processing, and service orchestration. in this change title something related to redis because in my repo i am creating 4-5 levels which have separate read.me so this is my level 2 so. remove level 2 and instead f advance backend engineering this is my repo title so something else