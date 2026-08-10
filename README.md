# 📚 NguyenHoang BookStore

> Ứng dụng bán sách trực tuyến full-stack hiện đại, xây dựng với React + TypeScript, Node.js/Express, PostgreSQL (Supabase) và Redis caching.

![Status](https://img.shields.io/badge/status-in%20development-orange)
![Node](https://img.shields.io/badge/node-%3E%3D18-green)
![License](https://img.shields.io/badge/license-ISC-blue)

---

## 📋 Mục lục

- [Tổng quan](#-tổng-quan)
- [Tech Stack](#-tech-stack)
- [Kiến trúc hệ thống](#-kiến-trúc-hệ-thống)
- [Cấu trúc thư mục](#-cấu-trúc-thư-mục)
- [Cài đặt & Chạy dự án](#-cài-đặt--chạy-dự-án)
- [Biến môi trường](#-biến-môi-trường)
- [API Endpoints](#-api-endpoints)
- [Caching với Redis](#-caching-với-redis)
- [Git Workflow](#-git-workflow)
- [Roadmap](#-roadmap)
- [Tác giả](#-tác-giả)

---

## 🌟 Tổng quan

NguyenHoang BookStore là nền tảng thương mại điện tử bán sách với đầy đủ tính năng:

- 🔐 **Authentication** — Đăng ký / đăng nhập bằng JWT + Refresh Token (HttpOnly Cookie)
- 📖 **Danh mục sách** — Cursor pagination, lọc, sắp xếp, xem chi tiết
- ⚡ **Redis Caching** — Cache danh sách sách, yêu thích, top-selling với TTL tự động
- 👤 **Trang Admin** — Quản lý sách, tác giả, nhà xuất bản, khách hàng, đơn hàng, thống kê
- 🎨 **UI hiện đại** — React 19 + TypeScript + Tailwind CSS

---

## 🛠 Tech Stack

### Backend
| Công nghệ | Version | Mục đích |
|-----------|---------|----------|
| **Node.js** | >= 18 | Runtime |
| **Express** | 5.x | Web framework |
| **PostgreSQL** | Supabase Cloud | Database chính |
| **Redis** | 6.x (Docker local) | Caching layer |
| **jsonwebtoken** | 9.x | JWT authentication |
| **bcrypt** | 6.x | Password hashing |
| **express-validator** | 7.x | Input validation |
| **winston** | 3.x | Structured logging |
| **nodemon** | dev | Auto-reload |

### Frontend
| Công nghệ | Version | Mục đích |
|-----------|---------|----------|
| **React** | 19.x | UI library |
| **TypeScript** | 6.x | Type safety |
| **Vite** | 8.x | Build tool |
| **Redux Toolkit** | 2.x | State management |
| **redux-persist** | 6.x | Persist auth state |
| **React Router** | 7.x | Routing |
| **Axios** | 1.x | HTTP client |
| **Tailwind CSS** | 3.x | Styling |
| **Heroicons** | 2.x | Icon library |

---

## 🏗 Kiến trúc hệ thống

```
┌─────────────────────────────────────────────────────┐
│              Frontend — React + TypeScript            │
│         (Vite, Redux Toolkit, React Router)          │
│                  http://localhost:5173               │
└──────────────────────┬──────────────────────────────┘
                       │ HTTP / REST API
┌──────────────────────▼──────────────────────────────┐
│            Backend — Express.js (Node.js)            │
│                  http://localhost:3000               │
│                                                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│  │   Routes    │─>│ Controllers │─>│  Services   │ │
│  └─────────────┘  └─────────────┘  └──────┬──────┘ │
│                                           │         │
│                          ┌────────────────▼──────┐  │
│                          │   redisCache.getOrSet  │  │
│                          │  (cache-aside pattern) │  │
│                          └──┬──────────────────┬──┘  │
│                          HIT│              MISS│      │
└─────────────────────────────┼──────────────────┼─────┘
                              │                  │
              ┌───────────────▼──┐   ┌───────────▼──────────┐
              │  Redis (Docker)  │   │ PostgreSQL (Supabase) │
              │  localhost:6379  │   │  ap-southeast-1      │
              └──────────────────┘   └──────────────────────┘
```

### Cache Strategy (Cache-Aside)
```
Request đến -> Redis HIT? -> Trả về cached data
                   |MISS
                   v
            Query PostgreSQL -> Lưu vào Redis (TTL) -> Trả về data
```

---

## 📁 Cấu trúc thư mục

```
NguyenHoang_BookStore/
│
├── be/                                   # Backend (Express.js)
│   └── src/
│       ├── app.js                        # Entry point
│       ├── config/
│       │   ├── database.config.js        # PostgreSQL pool (Supabase)
│       │   ├── redis.js                  # Redis client + graceful fallback
│       │   └── cor.config.js             # CORS config
│       ├── controllers/
│       │   ├── auth.controller.js
│       │   └── book.controller.js        # GET books, favorites, top-selling
│       ├── models/
│       │   ├── user.model.js
│       │   └── book.model.js             # DB queries + cursor pagination
│       ├── services/
│       │   ├── auth.service.js
│       │   └── book.service.js           # Business logic + Redis cache
│       ├── routes/
│       │   ├── index.route.js
│       │   ├── auth.route.js             # -> /api/auth
│       │   ├── book.route.js             # -> /api/books
│       │   └── user.route.js             # -> /api/users
│       ├── redis/
│       │   └── redisCache.js             # getOrSet, get, set, del, delPattern
│       ├── middlewares/
│       │   ├── errorrHandler.js          # Global error handler
│       │   └── validator/
│       │       └── auth.validators.js
│       ├── utils/
│       │   ├── logger.js                 # Winston logger
│       │   └── generateId.js
│       ├── constants/
│       │   ├── httpStatus.constant.js
│       │   └── errors.constant.js
│       └── errors/
│           └── AppError.js
│
├── fe/                                   # Frontend (React + TypeScript)
│   └── src/
│       ├── App.tsx                       # Router setup
│       ├── main.tsx                      # Redux + persist provider
│       ├── api/                          # Axios instances / API calls
│       ├── components/
│       │   ├── book-card/                # BookCard component
│       │   ├── layout/                   # Header, Footer
│       │   ├── modals/                   # NotificationModal, v.v.
│       │   ├── navigation/
│       │   ├── button/
│       │   ├── inputs/
│       │   └── card/
│       ├── pages/
│       │   ├── Login.tsx
│       │   ├── ErrorPage.tsx
│       │   ├── client/
│       │   │   ├── HomePage.tsx
│       │   │   ├── ProductPage.tsx
│       │   │   └── ProductDetailPage.tsx
│       │   └── admin/
│       │       ├── AdminHompage.tsx      # Dashboard
│       │       ├── AdminBooksPage.tsx
│       │       ├── AdminAuthorsPage.tsx
│       │       ├── AdminPublishersPage.tsx
│       │       ├── AdminCustomersPage.tsx
│       │       ├── AdminOrdersPage.tsx
│       │       └── AdminStatisticsPage.tsx
│       ├── redux/
│       │   ├── store.ts
│       │   └── slices/authSlice.ts
│       ├── hooks/
│       │   ├── useAuth.tsx
│       │   └── useBook.tsx
│       └── utils/
│
├── API_GUIDE.md                          # Chi tiết API documentation
├── DATABASE_DOCS.md                      # Schema & query docs
└── README.md
```

---

## 🚀 Cài đặt & Chạy dự án

### Yêu cầu

- **Node.js** >= 18
- **Docker** (để chạy Redis local)
- **npm**

### 1. Clone repo

```bash
git clone https://github.com/NguyennHoangg/NguyenHoang_BookStore.git
cd NguyenHoang_BookStore
```

### 2. Khởi động Redis (Docker)

```bash
docker run -d --name redis-bookstore -p 6379:6379 redis:latest
```

Kiểm tra Redis đang chạy:
```bash
docker exec redis-bookstore redis-cli PING
# -> PONG
```

### 3. Cài đặt & chạy Backend

```bash
cd be

# Cài dependencies
npm install

# Tạo file .env (xem phần Biến môi trường)

# Chạy dev server
npm run dev
# Server chạy tại http://localhost:3000
```

### 4. Cài đặt & chạy Frontend

```bash
cd fe

# Cài dependencies
npm install

# Chạy dev server
npm run dev
# App chạy tại http://localhost:5173
```

---

## ⚙️ Biến môi trường

### Backend (`be/.env`)

```env
# PostgreSQL — Supabase
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

# Redis — Local Docker (development)
REDIS_URL_DEV=redis://localhost:6379

# Redis — Production (Redis Cloud)
REDIS_URL_PROD=redis://default:password@your-redis-host:port
```

> **Lưu ý:** App tự động dùng `REDIS_URL_DEV` khi `NODE_ENV=development` và `REDIS_URL_PROD` khi production. Nếu Redis offline, app **fallback về DB** mà không crash.

---

## 📡 API Endpoints

> Xem chi tiết tại [API_GUIDE.md](./API_GUIDE.md)

### Authentication — `/api/auth`

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| `POST` | `/register` | Đăng ký tài khoản | ❌ |
| `POST` | `/login` | Đăng nhập, nhận JWT | ❌ |
| `POST` | `/refresh` | Làm mới access token | Cookie |
| `POST` | `/logout` | Đăng xuất, xóa cookie | ✅ |

### Books — `/api/books`

| Method | Endpoint | Mô tả | Cache TTL |
|--------|----------|-------|-----------|
| `GET` | `/` | Danh sách sách (cursor pagination) | 5 phút |
| `GET` | `/favorites` | Sách yêu thích | 10 phút |
| `GET` | `/top-selling` | Sách bán chạy | 30 phút |
| `GET` | `/:url` | Chi tiết sách theo URL slug | 10 phút |

#### Query params cho `GET /api/books`

```
?cursor=<id>     # Cursor phân trang (bỏ trống = trang đầu)
?limit=12        # Số sách mỗi trang (mặc định: 12, tối đa: 50)
?sortBy=default  # Sắp xếp: default | price | name | ...
```

#### Response format

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "nextCursor": "abc123",
    "hasNextPage": true,
    "limit": 12
  }
}
```

#### Error format

```json
{
  "success": false,
  "error": {
    "name": "ValidationError",
    "message": "limit phải từ 1 đến 50",
    "code": "INVALID_LIMIT",
    "statusCode": 400,
    "requestId": "req_xyz123",
    "timestamp": "2026-08-08T17:00:00Z"
  }
}
```

---

## ⚡ Caching với Redis

App dùng **Cache-Aside pattern** thông qua `redisCache.getOrSet()`:

```
request -> Redis HIT? -> return cached JSON
               |MISS
               v
          query DB -> setEx(key, TTL, data) -> return data

Redis lỗi? -> fallback về DB, không crash app
```

### Cache keys & TTL

| Key | TTL | Invalidate khi |
|-----|-----|---------------|
| `book:list:{cursor}:{limit}:{sortBy}` | 5 phút | Thêm/sửa/xóa sách |
| `book:detail:{url}` | 10 phút | Sửa sách đó |
| `book:favorites` | 10 phút | Cập nhật danh sách yêu thích |
| `book:top_selling:{limit}` | 30 phút | Cập nhật dữ liệu bán hàng |

### Debug Redis CLI

```bash
# Xem tất cả keys
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

## 🌿 Git Workflow

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

### ✅ Đã hoàn thành
- [x] Authentication (JWT + Refresh Token + HttpOnly Cookie)
- [x] Book API với cursor pagination
- [x] Redis caching layer (cache-aside, TTL, graceful fallback)
- [x] Admin UI (sách, tác giả, nhà xuất bản, khách hàng, đơn hàng, thống kê)
- [x] Structured logging (Winston)

### 🚧 Đang phát triển
- [ ] Trang sản phẩm client hoàn chỉnh
- [ ] Giỏ hàng & thanh toán
- [ ] Tìm kiếm & lọc sách nâng cao

### 📋 Kế hoạch
- [ ] Đánh giá & review sách
- [ ] Wishlist
- [ ] Hệ thống đơn hàng đầy đủ
- [ ] Email thông báo
- [ ] Deploy (Railway / Render + Redis Cloud)
- [ ] CI/CD pipeline

---

## 📖 Tài liệu bổ sung

- [API_GUIDE.md](./API_GUIDE.md) — Chi tiết toàn bộ API
- [DATABASE_DOCS.md](./DATABASE_DOCS.md) — Schema database, quan hệ bảng

---

## 👤 Tác giả

**Nguyễn Hoàng**
- GitHub: [@NguyennHoangg](https://github.com/NguyennHoangg)
- Email: nguyenhoang.dev.se@gmail.com

---

*Last updated: 2026-08-09 · Status: 🚧 In Development*
