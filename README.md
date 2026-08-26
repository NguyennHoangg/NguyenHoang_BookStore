# NguyenHoang BookStore

A full-stack e-commerce platform for book retail, built with React 19 + TypeScript on the frontend and Node.js/Express on the backend, backed by PostgreSQL (Supabase) and Redis caching.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Caching Strategy](#caching-strategy)
- [Git Workflow](#git-workflow)
- [Roadmap](#roadmap)
- [Documentation](#documentation)
- [Author](#author)

---

## Overview

NguyenHoang BookStore provides a complete online bookstore experience with the following capabilities:

- **Authentication** — JWT-based login and registration with Refresh Token rotation via HttpOnly cookies.
- **Book Catalog** — Cursor-based pagination, filtering by category and price, and detailed product pages.
- **Redis Caching** — Cache-aside pattern applied to high-traffic read endpoints with automatic TTL management.
- **Admin Dashboard** — Manage books, authors, publishers, customers, orders, and view sales statistics.
- **Modern UI** — Built with React 19, TypeScript, Vite, and Tailwind CSS.

---

## Tech Stack

### Backend

| Technology | Version | Purpose |
|---|---|---|
| Node.js | >= 18 | Runtime environment |
| Express | 5.x | Web framework |
| PostgreSQL (Supabase) | Cloud | Primary database |
| Redis | 6.x | Caching layer |
| jsonwebtoken | 9.x | JWT authentication |
| bcrypt | 6.x | Password hashing |
| express-validator | 7.x | Input validation |
| winston | 3.x | Structured logging |
| nodemon | 3.x | Development auto-reload |

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| React | 19.x | UI library |
| TypeScript | 6.x | Static typing |
| Vite | 8.x | Build tool |
| Redux Toolkit | 2.x | Global state management |
| redux-persist | 6.x | Persist authentication state |
| React Router | 7.x | Client-side routing |
| Axios | 1.x | HTTP client |
| Tailwind CSS | 3.x | Utility-first styling |
| rc-slider | 11.x | Price range filter UI |

---

## System Architecture

```
+-------------------------------------------------+
|        Frontend -- React + TypeScript           |
|      Vite . Redux Toolkit . React Router        |
|            http://localhost:5173                |
+----------------------+--------------------------+
                       | HTTP / REST API
+----------------------v--------------------------+
|         Backend -- Express.js (Node.js)         |
|               http://localhost:3000             |
|                                                 |
|  Routes -> Controllers -> Services             |
|                               |                 |
|                  redisCache.getOrSet()          |
|                  (cache-aside pattern)          |
|                    /              \             |
|               HIT /            MISS \           |
+----------------/------------------\-------------+
                /                    \
  +------------v------+   +----------v-----------+
  |  Redis (Docker)   |   | PostgreSQL (Supabase) |
  |  localhost:6379   |   |  ap-southeast-1      |
  +-------------------+   +----------------------+
```

### Cache-Aside Flow

```
Incoming request
       |
       v
  Redis HIT? ----yes----> Return cached response
       |
      no
       |
       v
  Query PostgreSQL
       |
       v
  Store in Redis (with TTL)
       |
       v
  Return response

  Redis unavailable? -> Fallback to PostgreSQL, no crash
```

---

## Project Structure

```
NguyenHoang_BookStore/
|
+-- be/                                     # Backend (Express.js)
|   +-- src/
|       +-- app.js                          # Entry point
|       +-- config/
|       |   +-- database.config.js          # PostgreSQL pool (Supabase)
|       |   +-- redis.js                    # Redis client + graceful fallback
|       |   +-- cor.config.js               # CORS configuration
|       +-- controllers/
|       |   +-- auth.controller.js
|       |   +-- book.controller.js
|       |   +-- user.controller.js
|       +-- models/
|       |   +-- user.model.js
|       |   +-- book.model.js               # DB queries + cursor pagination
|       +-- services/
|       |   +-- auth.service.js
|       |   +-- book.service.js             # Business logic + Redis cache
|       |   +-- user.service.js
|       +-- routes/
|       |   +-- index.route.js
|       |   +-- auth.route.js               # /api/auth
|       |   +-- book.route.js               # /api/books
|       |   +-- users.route.js              # /api/users
|       +-- redis/
|       |   +-- redisCache.js               # getOrSet, get, set, del, delPattern
|       +-- middlewares/
|       |   +-- errorHandler.js             # Global error handler
|       |   +-- validator/
|       |       +-- auth.validators.js
|       +-- utils/
|       |   +-- logger.js                   # Winston logger
|       |   +-- generateId.js
|       +-- constants/
|       |   +-- httpStatus.constant.js
|       |   +-- errors.constant.js
|       +-- errors/
|           +-- AppError.js
|
+-- fe/                                     # Frontend (React + TypeScript)
|   +-- src/
|       +-- App.tsx                         # Router configuration
|       +-- main.tsx                        # Redux + persist provider
|       +-- api/                            # Axios instances and API modules
|       +-- components/
|       |   +-- book-card/
|       |   +-- layout/                     # Header, Footer
|       |   +-- filter/                     # CategoryFilter, PriceFilter
|       |   +-- modals/
|       |   +-- navigation/
|       |   +-- skeleton/                   # Loading skeleton components
|       |   +-- common/                     # Breadcrumbs, Pagination
|       |   +-- button/
|       |   +-- card/
|       +-- pages/
|       |   +-- Login.tsx
|       |   +-- ErrorPage.tsx
|       |   +-- client/
|       |   |   +-- HomePage.tsx
|       |   |   +-- ProductPage.tsx
|       |   |   +-- ProductDetailPage.tsx
|       |   +-- admin/
|       |       +-- AdminHomepage.tsx        # Dashboard
|       |       +-- AdminBooksPage.tsx
|       |       +-- AdminAuthorsPage.tsx
|       |       +-- AdminPublishersPage.tsx
|       |       +-- AdminCustomersPage.tsx
|       |       +-- AdminOrdersPage.tsx
|       |       +-- AdminStatisticsPage.tsx
|       +-- redux/
|       |   +-- store.ts
|       |   +-- slices/authSlice.ts
|       +-- hooks/
|       |   +-- useAuth.tsx
|       |   +-- useBook.tsx
|       |   +-- useUser.tsx
|       +-- utils/
|
+-- API_GUIDE.md                            # Full API documentation
+-- DATABASE_DOCS.md                        # Database schema and relationships
+-- README.md
```

---

## Getting Started

### Prerequisites

- Node.js >= 18
- Docker (for local Redis)
- npm

### 1. Clone the repository

```bash
git clone https://github.com/NguyennHoangg/NguyenHoang_BookStore.git
cd NguyenHoang_BookStore
```

### 2. Start Redis with Docker

```bash
docker run -d --name redis-bookstore -p 6379:6379 redis:latest
```

Verify Redis is running:

```bash
docker exec redis-bookstore redis-cli PING
# Expected: PONG
```

### 3. Set up and run the backend

```bash
cd be
npm install
# Create be/.env -- see Environment Variables section
npm run dev
# Server available at http://localhost:3000
```

### 4. Set up and run the frontend

```bash
cd fe
npm install
npm run dev
# App available at http://localhost:5173
```

---

## Environment Variables

### Backend -- `be/.env`

```env
# PostgreSQL (Supabase)
DB_USER=your_supabase_user
DB_HOST=aws-1-ap-southeast-1.pooler.supabase.com
DB_NAME=postgres
DB_PASSWORD=your_password
DB_PORT=6543
DB_URL=postgresql://user:password@host:6543/postgres

# Server
PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1h
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRES_IN=7d
JWT_REFRESH_KEY=your_refresh_key

# Redis -- Local (development)
REDIS_URL_DEV=redis://localhost:6379

# Redis -- Production
REDIS_URL_PROD=redis://default:password@your-redis-host:port
```

The application automatically selects `REDIS_URL_DEV` when `NODE_ENV=development` and `REDIS_URL_PROD` in production. If Redis is unavailable, the application falls back to PostgreSQL without crashing.

---

## API Reference

Full documentation is available in [API_GUIDE.md](./API_GUIDE.md).

### Authentication -- `/api/auth`

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/register` | Register a new account | No |
| POST | `/login` | Log in and receive JWT | No |
| POST | `/refresh` | Refresh access token | Cookie |
| POST | `/logout` | Log out and clear cookie | Yes |

### Books -- `/api/books`

| Method | Endpoint | Description | Cache TTL |
|---|---|---|---|
| GET | `/` | List books (cursor pagination) | 5 minutes |
| GET | `/favorites` | Favorite books | 10 minutes |
| GET | `/top-selling` | Best-selling books | 30 minutes |
| GET | `/:url` | Book detail by URL slug | 10 minutes |

#### Query parameters for `GET /api/books`

| Parameter | Type | Default | Description |
|---|---|---|---|
| `cursor` | string | -- | Pagination cursor (omit for first page) |
| `limit` | number | 12 | Results per page (max: 50) |
| `sortBy` | string | `default` | Sort order |

#### Standard response format

```json
{
  "success": true,
  "data": [],
  "pagination": {
    "nextCursor": "abc123",
    "hasNextPage": true,
    "limit": 12
  }
}
```

#### Error response format

```json
{
  "success": false,
  "error": {
    "name": "ValidationError",
    "message": "limit must be between 1 and 50",
    "code": "INVALID_LIMIT",
    "statusCode": 400,
    "requestId": "req_xyz123",
    "timestamp": "2026-08-26T00:00:00Z"
  }
}
```

---

## Caching Strategy

The application uses the **Cache-Aside** pattern via `redisCache.getOrSet()`.

### Cache keys and TTL

| Cache Key | TTL | Invalidated When |
|---|---|---|
| `book:list:{cursor}:{limit}:{sortBy}` | 5 minutes | Book is created, updated, or deleted |
| `book:detail:{url}` | 10 minutes | That specific book is updated |
| `book:favorites` | 10 minutes | Favorites list is updated |
| `book:top_selling:{limit}` | 30 minutes | Sales data is updated |

### Redis debugging

```bash
# List all cache keys
docker exec redis-bookstore redis-cli KEYS "*"

# Xem TTL còn lại (giây)
docker exec redis-bookstore redis-cli TTL book:favorites

# Xem value của key
docker exec redis-bookstore redis-cli GET book:favorites

# Xóa cache để test MISS
docker exec redis-bookstore redis-cli DEL book:favorites

# Monitor real-time mọi lệnh Redis
docker exec -it redis-bookstore redis-cli MONITOR
```

---

##  Git Workflow

### Branches

| Branch | Mục đích |
|--------|----------|
| `main` | Production-ready |
| `develop` | Integration |
| `feature/*` | Tính năng mới |
| `bugfix/*` | Bug fixes |
| `hotfix/*` | Hotfix production |

### Branches hiện tại

- `main` — Base
- `feature/auth` — Authentication system (JWT, register, login, refresh, logout)
- `feature/book-cache` — Book API + Redis caching layer

### Commit convention

```
<type>(<scope>): <subject>

<body>
```

**Types:** `feat` · `fix` · `docs` · `style` · `refactor` · `test` · `chore`

**Ví dụ:**
```
feat(book): add book API with Redis caching layer

- Add book.model.js: cursor pagination queries
- Add book.service.js: cache-aside with getOrSet
- Fix: CACHE_KEY arrow functions missing return
```

---

## 🗺 Roadmap

###  Đã hoàn thành
- [x] Authentication (JWT + Refresh Token + HttpOnly Cookie)
- [x] Book API với cursor pagination
- [x] Redis caching layer (cache-aside, TTL, graceful fallback)
- [x] Admin UI (sách, tác giả, nhà xuất bản, khách hàng, đơn hàng, thống kê)
- [x] Structured logging (Winston)

###  Đang phát triển
- [ ] Trang sản phẩm client hoàn chỉnh
- [ ] Giỏ hàng & thanh toán
- [ ] Tìm kiếm & lọc sách nâng cao

###  Kế hoạch
- [ ] Đánh giá & review sách
- [ ] Wishlist
- [ ] Hệ thống đơn hàng đầy đủ
- [ ] Email thông báo
- [ ] Deploy (Railway / Render + Redis Cloud)
- [ ] CI/CD pipeline

---

##  Tài liệu bổ sung

- [API_GUIDE.md](./API_GUIDE.md) — Chi tiết toàn bộ API
- [DATABASE_DOCS.md](./DATABASE_DOCS.md) — Schema database, quan hệ bảng

---

##  Tác giả

**Nguyễn Hoàng**
- GitHub: [@NguyennHoangg](https://github.com/NguyennHoangg)
- Email: nguyenhoang.dev.se@gmail.com

---

*Last updated: 2026-08-09 · Status: 🚧 In Development*
