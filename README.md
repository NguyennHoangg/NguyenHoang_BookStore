#  NguyenHoang BookStore

A modern full-stack bookstore application built with React, Node.js, and PostgreSQL. This project demonstrates best practices in web development, authentication, and API design.

##  Project Overview

A complete e-commerce platform for selling books with user authentication, product catalog, shopping cart, order management, and payment processing.

##  Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Client Layer (React)                      │
│  (Vite, Tailwind CSS, Zustand, React Query)                 │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│              API Gateway / Load Balancer                     │
│              (Nginx - Rate Limiting, CORS)                   │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│                 Backend Services (Node.js)                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  • Auth Service (JWT, OAuth2)                        │  │
│  │  • Book Catalog Service (Search, Filter)             │  │
│  │  • Order Service (CRUD, Status Tracking)             │  │
│  │  • Payment Service (Stripe Integration)              │  │
│  │  • User Service (Profile, Preferences)               │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│               Data Layer & Message Queue                     │
│  ┌──────────────────┐  ┌──────────────────┐              │
│  │  PostgreSQL DB   │  │  Redis Cache     │              │
│  │                  │  │                  │              │
│  │  • Users         │  │  • Sessions      │              │
│  │  • Books         │  │  • Tokens        │              │
│  │  • Orders        │  │  • Cart          │              │
│  │  • Payments      │  │                  │              │
│  └──────────────────┘  └──────────────────┘              │
│                                                           │
│  ┌─────────────────────────────────────────────────────┐ │
│  │  Kafka (Event Streaming)                            │ │
│  │  • order.created                                    │ │
│  │  • payment.completed                                │ │
│  │  • inventory.updated                                │ │
│  └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

##  Quick Start

### Prerequisites

- **Node.js** v18+
- **PostgreSQL** 14+
- **Redis** 6+
- **npm** or **yarn**

### Backend Setup

```bash
# Navigate to backend directory
cd be

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your configuration

# Run database migrations
npm run migrate

# Start development server
npm run dev

# Server runs on http://localhost:3000/api
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd fe

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with API base URL

# Start development server
npm run dev

# Frontend runs on http://localhost:5173
```

##  Project Structure

```
NguyenHoang_BookStore/
├── be/                              # Backend (Express.js)
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.config.js   # PostgreSQL connection
│   │   │   └── cors.config.js       # CORS settings
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── book.controller.js
│   │   │   ├── order.controller.js
│   │   │   └── payment.controller.js
│   │   ├── models/
│   │   │   ├── user.model.js
│   │   │   ├── book.model.js
│   │   │   └── order.model.js
│   │   ├── services/
│   │   │   ├── auth.service.js
│   │   │   ├── book.service.js
│   │   │   └── order.service.js
│   │   ├── routes/
│   │   │   ├── auth.route.js
│   │   │   ├── book.route.js
│   │   │   └── order.route.js
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js
│   │   │   └── errorHandler.js
│   │   ├── utils/
│   │   │   ├── jwt.js
│   │   │   └── generateId.js
│   │   ├── constants/
│   │   │   ├── errors.constant.js
│   │   │   └── httpStatus.constant.js
│   │   ├── errors/
│   │   │   └── AppError.js
│   │   └── app.js
│   ├── .env.example
│   └── package.json
│
├── fe/                              # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── BookCard.tsx
│   │   │   ├── CartDrawer.tsx
│   │   │   └── SearchBar.tsx
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   ├── Books.tsx
│   │   │   ├── BookDetail.tsx
│   │   │   └── Checkout.tsx
│   │   ├── hooks/
│   │   │   └── useAuth.ts
│   │   ├── store/
│   │   │   ├── authStore.ts
│   │   │   └── cartStore.ts
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── .env.example
│   └── package.json
│
├── API_GUIDE.md                    # API Documentation
├── kien-truc-web-ban-sach.md       # Architecture Guide
└── README.md                        # This file
```

##  Authentication

### Login Flow

1. **User submits credentials** → POST `/api/auth/login`
2. **Server validates** → Check email & password hash
3. **Generate tokens**:
   - `accessToken` (60 mins) → Sent in response
   - `refreshToken` (7 days) → Stored in HttpOnly cookie
4. **Client stores accessToken** → Used for subsequent requests
5. **Token refresh** → POST `/api/auth/refresh` when expired

### Protected Routes

All endpoints (except auth) require `Authorization: Bearer {accessToken}` header.

```javascript
// Example request
axios.get('/api/users/profile', {
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});
```

##  API Endpoints

For detailed API documentation, see [API_GUIDE.md](./API_GUIDE.md)

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - User logout

### Books
- `GET /api/books` - Get all books (with filters)
- `GET /api/books/:id` - Get book details
- `GET /api/books/search?q=query` - Search books

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order details
- `DELETE /api/orders/:id` - Cancel order

### Payments
- `POST /api/payments/intent` - Create payment intent
- `POST /api/payments/confirm` - Confirm payment

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `POST /api/users/change-password` - Change password

## 🔧 Configuration

### Backend `.env`

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/bookstore_db
DATABASE_POOL_SIZE=20

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your_refresh_secret_key_here
JWT_REFRESH_EXPIRES_IN=7d

# Server
NODE_ENV=development
PORT=3000

# Stripe
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxx
STRIPE_PUBLISH_KEY=pk_test_xxxxxxxxxxxx

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_password
```

### Frontend `.env`

```env
VITE_API_URL=http://localhost:3000/api
VITE_STRIPE_PUBLIC_KEY=pk_test_xxxxxxxxxxxx
```

##  Dependencies

### Backend
- **express** - Web framework
- **pg** - PostgreSQL client
- **bcrypt** - Password hashing
- **jsonwebtoken** - JWT authentication
- **stripe** - Payment processing
- **redis** - Caching
- **cors** - Cross-origin requests
- **dotenv** - Environment variables

### Frontend
- **react** - UI library
- **axios** - HTTP client
- **zustand** - State management
- **react-query** - Data fetching
- **tailwindcss** - CSS framework
- **vite** - Build tool

##  Testing

```bash
# Backend tests
cd be
npm run test

# Frontend tests
cd fe
npm run test
```

##  Error Handling

All API errors follow standard format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "statusCode": 400,
    "timestamp": "2025-04-10T10:30:00Z",
    "requestId": "req_xyz123"
  }
}
```

##  Git Workflow

### Branch Naming Convention
- `main` - Production ready
- `develop` - Integration branch
- `feature/*` - Feature development
- `bugfix/*` - Bug fixes
- `hotfix/*` - Production hotfixes

### Commit Convention

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Code style
- `refactor:` - Code refactoring
- `test:` - Tests
- `chore:` - Maintenance

**Example:**
```
feat(auth): implement JWT refresh token

- Add refresh token endpoint
- Store tokens in HttpOnly cookies
- Implement token rotation logic
```

##  Deployment

### Docker

```bash
# Build backend image
docker build -t bookstore-be ./be

# Build frontend image
docker build -t bookstore-fe ./fe

# Run with docker-compose
docker-compose up -d
```

### Environment Deployment

```bash
# Production deployment
npm run build
npm start
```

##  Performance Optimization

- ✅ Response caching with Redis
- ✅ Database query optimization & indexing
- ✅ Lazy loading for frontend components
- ✅ CDN for static assets
- ✅ Compression (gzip)
- ✅ Rate limiting

##  Security Best Practices

- ✅ Password hashing (bcrypt)
- ✅ JWT for authentication
- ✅ HTTPS enforced (production)
- ✅ CORS configuration
- ✅ Input validation & sanitization
- ✅ SQL injection prevention (parameterized queries)
- ✅ XSS protection
- ✅ CSRF protection
- ✅ Rate limiting

##  Contributing

1. Create feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -m "feat: description"`
3. Push to branch: `git push origin feature/your-feature`
4. Create Pull Request

##  License

MIT License - See LICENSE file for details

##  Author

**Nguyễn Hoàng**
- GitHub: [@NguyennHoangg](https://github.com/NguyennHoangg)
- Email: nguyenhoang.dev.se@gmail.com

##  Support

For issues and questions:
1. Check [API_GUIDE.md](./API_GUIDE.md) for API documentation
2. Review [Architecture Guide](./kien-truc-web-ban-sach.md)
3. Open an issue on GitHub

##  Roadmap

- [ ] User wishlist feature
- [ ] Book reviews & ratings
- [ ] Recommendation engine
- [ ] Admin dashboard
- [ ] Inventory management
- [ ] Email notifications
- [ ] SMS notifications
- [ ] Mobile app (React Native)
- [ ] Analytics dashboard
- [ ] Multi-language support

---

**Last Updated:** April 10, 2026  
**Status:** 🚧 In Development
