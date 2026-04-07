# Kiến trúc hệ thống Web Bán Sách — Hướng dẫn từng tầng

---

## Tổng quan kiến trúc

```
[Client Layer]  →  [API Gateway]  →  [Microservices]  →  [Message Queue]  →  [Data Layer]
```

---

## Tầng 1: Client Layer

### Công nghệ
- **Web App**: Next.js 14 (App Router)
- **Mobile**: React Native (hoặc Flutter)
- **Admin Panel**: Next.js + shadcn/ui
- **CDN**: Cloudflare (hình ảnh, assets tĩnh)

### Cài đặt Web App

```bash
npx create-next-app@latest bookstore-web --typescript --tailwind --app
cd bookstore-web
npm install axios swr zustand react-query
```

### Cấu trúc thư mục (Next.js)

```
bookstore-web/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── books/
│   │   ├── page.tsx          # Danh sách sách
│   │   └── [id]/page.tsx     # Chi tiết sách
│   ├── cart/page.tsx
│   ├── orders/page.tsx
│   └── layout.tsx
├── components/
│   ├── BookCard.tsx
│   ├── CartDrawer.tsx
│   └── SearchBar.tsx
├── lib/
│   ├── api.ts                # Axios instance
│   └── auth.ts
└── store/
    └── cartStore.ts          # Zustand store
```

### Ví dụ: Axios instance với interceptor

```typescript
// lib/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      // Refresh token logic
    }
    return Promise.reject(error);
  }
);

export default api;
```

### Ví dụ: Zustand cart store

```typescript
// store/cartStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  coverImage: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  totalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => set((state) => {
        const existing = state.items.find(i => i.id === item.id);
        if (existing) {
          return { items: state.items.map(i =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          )};
        }
        return { items: [...state.items, { ...item, quantity: 1 }] };
      }),
      removeItem: (id) => set((state) => ({
        items: state.items.filter(i => i.id !== id)
      })),
      clearCart: () => set({ items: [] }),
      totalPrice: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    { name: 'cart-storage' }
  )
);
```

---

## Tầng 2: API Gateway / Load Balancer

### Công nghệ
- **API Gateway**: Kong hoặc Nginx
- **Load Balancer**: AWS ALB hoặc Nginx
- **Auth Middleware**: JWT + OAuth2

### Cài đặt Nginx làm API Gateway

```nginx
# /etc/nginx/conf.d/bookstore.conf
upstream user_service    { server user-service:3001; }
upstream catalog_service { server catalog-service:3002; }
upstream order_service   { server order-service:3003; }
upstream payment_service { server payment-service:3004; }

server {
  listen 80;
  server_name api.bookstore.com;

  # Rate limiting
  limit_req_zone $binary_remote_addr zone=api:10m rate=30r/m;
  limit_req zone=api burst=10 nodelay;

  # CORS
  add_header Access-Control-Allow-Origin  $http_origin always;
  add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
  add_header Access-Control-Allow-Headers "Authorization, Content-Type" always;

  location /api/v1/users/    { proxy_pass http://user_service; }
  location /api/v1/books/    { proxy_pass http://catalog_service; }
  location /api/v1/orders/   { proxy_pass http://order_service; }
  location /api/v1/payments/ { proxy_pass http://payment_service; }
}
```

### Docker Compose cho toàn bộ hệ thống

```yaml
# docker-compose.yml
version: '3.8'
services:
  nginx:
    image: nginx:alpine
    ports: ["80:80", "443:443"]
    volumes:
      - ./nginx/conf.d:/etc/nginx/conf.d
    depends_on:
      - user-service
      - catalog-service
      - order-service

  user-service:
    build: ./services/user-service
    environment:
      - DATABASE_URL=postgresql://postgres:password@postgres:5432/users_db
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=${JWT_SECRET}
    ports: ["3001:3001"]

  catalog-service:
    build: ./services/catalog-service
    environment:
      - DATABASE_URL=postgresql://postgres:password@postgres:5432/catalog_db
      - ELASTICSEARCH_URL=http://elasticsearch:9200
    ports: ["3002:3002"]

  order-service:
    build: ./services/order-service
    environment:
      - DATABASE_URL=postgresql://postgres:password@postgres:5432/orders_db
      - KAFKA_BROKERS=kafka:9092
    ports: ["3003:3003"]

  payment-service:
    build: ./services/payment-service
    environment:
      - STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY}
      - KAFKA_BROKERS=kafka:9092
    ports: ["3004:3004"]

  postgres:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql

  redis:
    image: redis:7-alpine
    volumes: [redis_data:/data]

  elasticsearch:
    image: elasticsearch:8.11.0
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false
    volumes: [es_data:/usr/share/elasticsearch/data]

  kafka:
    image: confluentinc/cp-kafka:7.5.0
    environment:
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka:9092
    depends_on: [zookeeper]

  zookeeper:
    image: confluentinc/cp-zookeeper:7.5.0
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181

volumes:
  postgres_data:
  redis_data:
  es_data:
```

---

## Tầng 3: Microservices

> Mỗi service là một Node.js/Express app độc lập (hoặc NestJS).

### 3.1 User Service

```bash
mkdir services/user-service && cd services/user-service
npm init -y
npm install express bcryptjs jsonwebtoken pg redis dotenv
npm install -D typescript @types/express @types/node ts-node-dev
```

```typescript
// services/user-service/src/routes/auth.ts
import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../db';

const router = Router();

router.post('/register', async (req: Request, res: Response) => {
  const { email, password, fullName } = req.body;
  const hashedPassword = await bcrypt.hash(password, 12);

  const result = await pool.query(
    'INSERT INTO users (email, password, full_name) VALUES ($1,$2,$3) RETURNING id, email',
    [email, hashedPassword, fullName]
  );

  const token = jwt.sign(
    { userId: result.rows[0].id },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' }
  );

  res.status(201).json({ user: result.rows[0], token });
});

router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

  if (!result.rows[0]) return res.status(401).json({ message: 'Sai email hoặc mật khẩu' });

  const valid = await bcrypt.compare(password, result.rows[0].password);
  if (!valid) return res.status(401).json({ message: 'Sai email hoặc mật khẩu' });

  const token = jwt.sign(
    { userId: result.rows[0].id },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' }
  );

  res.json({ token });
});

export default router;
```

### 3.2 Catalog Service (Books)

```typescript
// services/catalog-service/src/routes/books.ts
import { Router } from 'express';
import { pool } from '../db';
import { esClient } from '../elasticsearch';

const router = Router();

// Lấy danh sách sách (có phân trang, lọc)
router.get('/', async (req, res) => {
  const { page = 1, limit = 20, category, minPrice, maxPrice } = req.query;
  const offset = (Number(page) - 1) * Number(limit);

  let query = 'SELECT * FROM books WHERE 1=1';
  const params: any[] = [];

  if (category) { params.push(category); query += ` AND category = $${params.length}`; }
  if (minPrice) { params.push(minPrice); query += ` AND price >= $${params.length}`; }
  if (maxPrice) { params.push(maxPrice); query += ` AND price <= $${params.length}`; }

  params.push(limit, offset);
  query += ` LIMIT $${params.length - 1} OFFSET $${params.length}`;

  const result = await pool.query(query, params);
  res.json({ books: result.rows, page: Number(page), limit: Number(limit) });
});

// Tìm kiếm full-text qua Elasticsearch
router.get('/search', async (req, res) => {
  const { q, page = 1, size = 20 } = req.query;

  const result = await esClient.search({
    index: 'books',
    from: (Number(page) - 1) * Number(size),
    size: Number(size),
    query: {
      multi_match: {
        query: String(q),
        fields: ['title^3', 'author^2', 'description'],
        fuzziness: 'AUTO',
      }
    }
  });

  res.json({
    books: result.hits.hits.map(h => h._source),
    total: result.hits.total,
  });
});

export default router;
```

### 3.3 Order Service

```typescript
// services/order-service/src/routes/orders.ts
import { Router } from 'express';
import { pool } from '../db';
import { producer } from '../kafka';

const router = Router();

router.post('/', async (req, res) => {
  const { userId, items, shippingAddress } = req.body;

  // Tính tổng tiền
  const totalAmount = items.reduce(
    (sum: number, item: any) => sum + item.price * item.quantity, 0
  );

  // Tạo order trong DB
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const orderResult = await client.query(
      `INSERT INTO orders (user_id, total_amount, status, shipping_address)
       VALUES ($1, $2, 'pending', $3) RETURNING id`,
      [userId, totalAmount, shippingAddress]
    );
    const orderId = orderResult.rows[0].id;

    for (const item of items) {
      await client.query(
        `INSERT INTO order_items (order_id, book_id, quantity, unit_price)
         VALUES ($1, $2, $3, $4)`,
        [orderId, item.bookId, item.quantity, item.price]
      );
    }

    await client.query('COMMIT');

    // Phát sự kiện lên Kafka
    await producer.send({
      topic: 'order.created',
      messages: [{ value: JSON.stringify({ orderId, userId, items, totalAmount }) }]
    });

    res.status(201).json({ orderId, status: 'pending', totalAmount });
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
});

export default router;
```

### 3.4 Payment Service (tích hợp Stripe)

```typescript
// services/payment-service/src/routes/payments.ts
import { Router } from 'express';
import Stripe from 'stripe';
import { producer } from '../kafka';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const router = Router();

// Tạo payment intent
router.post('/intent', async (req, res) => {
  const { orderId, amount, currency = 'vnd' } = req.body;

  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency,
    metadata: { orderId },
  });

  res.json({ clientSecret: paymentIntent.client_secret });
});

// Webhook từ Stripe
router.post('/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature']!;
  const event = stripe.webhooks.constructEvent(
    req.body, sig, process.env.STRIPE_WEBHOOK_SECRET!
  );

  if (event.type === 'payment_intent.succeeded') {
    const intent = event.data.object as Stripe.PaymentIntent;
    await producer.send({
      topic: 'payment.completed',
      messages: [{ value: JSON.stringify({
        orderId: intent.metadata.orderId,
        amount: intent.amount,
      })}]
    });
  }

  res.json({ received: true });
});

export default router;
```

---

## Tầng 4: Message Queue (Kafka)

### Kafka Topics

| Topic | Producer | Consumer | Mô tả |
|-------|----------|----------|-------|
| `order.created` | Order Service | Inventory, Notification | Đơn hàng mới |
| `payment.completed` | Payment Service | Order, Notification | Thanh toán thành công |
| `stock.updated` | Inventory Service | Catalog Service | Cập nhật tồn kho |
| `user.registered` | User Service | Notification | Email chào mừng |

### Ví dụ: Notification Consumer

```typescript
// services/notification-service/src/consumers/orderConsumer.ts
import { Kafka } from 'kafkajs';
import { sendEmail } from '../email';

const kafka = new Kafka({ brokers: [process.env.KAFKA_BROKERS!] });
const consumer = kafka.consumer({ groupId: 'notification-group' });

export async function startOrderConsumer() {
  await consumer.connect();
  await consumer.subscribe({ topics: ['order.created', 'payment.completed'] });

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      const data = JSON.parse(message.value!.toString());

      if (topic === 'order.created') {
        await sendEmail({
          to: data.userEmail,
          subject: `Đơn hàng #${data.orderId} đã được đặt`,
          template: 'order-confirmation',
          context: { orderId: data.orderId, totalAmount: data.totalAmount },
        });
      }

      if (topic === 'payment.completed') {
        await sendEmail({
          to: data.userEmail,
          subject: `Thanh toán thành công cho đơn #${data.orderId}`,
          template: 'payment-success',
          context: { orderId: data.orderId },
        });
      }
    }
  });
}
```

---

## Tầng 5: Data Layer

### 5.1 PostgreSQL — Schema chính

```sql
-- init.sql

-- Users DB
CREATE TABLE users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email       VARCHAR(255) UNIQUE NOT NULL,
  password    TEXT NOT NULL,
  full_name   VARCHAR(255),
  role        VARCHAR(20) DEFAULT 'customer',
  created_at  TIMESTAMP DEFAULT NOW()
);

-- Catalog DB
CREATE TABLE books (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title         VARCHAR(500) NOT NULL,
  author        VARCHAR(255) NOT NULL,
  description   TEXT,
  price         DECIMAL(10,2) NOT NULL,
  stock_quantity INT DEFAULT 0,
  category      VARCHAR(100),
  cover_image   TEXT,
  isbn          VARCHAR(20) UNIQUE,
  published_at  DATE,
  created_at    TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_books_category ON books(category);
CREATE INDEX idx_books_price    ON books(price);

-- Orders DB
CREATE TABLE orders (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL,
  total_amount     DECIMAL(12,2) NOT NULL,
  status           VARCHAR(30) DEFAULT 'pending',
  shipping_address JSONB,
  created_at       TIMESTAMP DEFAULT NOW()
);

CREATE TABLE order_items (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id   UUID REFERENCES orders(id),
  book_id    UUID NOT NULL,
  quantity   INT NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL
);

CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status  ON orders(status);
```

### 5.2 Redis — Cache & Session

```typescript
// lib/redis.ts
import { createClient } from 'redis';

const redis = createClient({ url: process.env.REDIS_URL });
await redis.connect();

// Cache danh sách sách (TTL 5 phút)
export async function getCachedBooks(key: string) {
  const cached = await redis.get(key);
  return cached ? JSON.parse(cached) : null;
}

export async function setCachedBooks(key: string, data: any, ttl = 300) {
  await redis.setEx(key, ttl, JSON.stringify(data));
}

// Cache giỏ hàng theo userId
export async function getCart(userId: string) {
  const cart = await redis.hGetAll(`cart:${userId}`);
  return cart;
}

export async function addToCart(userId: string, bookId: string, quantity: number) {
  await redis.hSet(`cart:${userId}`, bookId, quantity);
  await redis.expire(`cart:${userId}`, 7 * 24 * 3600); // 7 ngày
}
```

### 5.3 Elasticsearch — Index sách

```typescript
// scripts/indexBooks.ts
import { Client } from '@elastic/elasticsearch';
import { pool } from './db';

const es = new Client({ node: process.env.ELASTICSEARCH_URL });

async function indexAllBooks() {
  // Tạo index với mapping
  await es.indices.create({
    index: 'books',
    mappings: {
      properties: {
        title:       { type: 'text', analyzer: 'standard' },
        author:      { type: 'text', analyzer: 'standard' },
        description: { type: 'text', analyzer: 'standard' },
        category:    { type: 'keyword' },
        price:       { type: 'float' },
        cover_image: { type: 'keyword', index: false },
      }
    }
  });

  // Lấy tất cả sách từ PostgreSQL
  const { rows } = await pool.query('SELECT * FROM books');

  // Bulk index
  const body = rows.flatMap(book => [
    { index: { _index: 'books', _id: book.id } },
    { title: book.title, author: book.author, description: book.description,
      category: book.category, price: book.price, cover_image: book.cover_image }
  ]);

  await es.bulk({ body });
  console.log(`Đã index ${rows.length} sách vào Elasticsearch`);
}

indexAllBooks();
```

---

## Monitoring & CI/CD

### Prometheus + Grafana (monitoring cơ bản)

```yaml
# docker-compose.monitoring.yml
services:
  prometheus:
    image: prom/prometheus
    volumes: [./prometheus.yml:/etc/prometheus/prometheus.yml]
    ports: ["9090:9090"]

  grafana:
    image: grafana/grafana
    ports: ["3000:3000"]
    environment:
      GF_SECURITY_ADMIN_PASSWORD: admin

  node-exporter:
    image: prom/node-exporter
    ports: ["9100:9100"]
```

### GitHub Actions CI/CD

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci && npm test

  build-and-deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build & push Docker images
        run: |
          docker build -t bookstore/user-service ./services/user-service
          docker push bookstore/user-service
      - name: Deploy to Kubernetes
        run: kubectl apply -f k8s/
```

---

## Thứ tự xây dựng được khuyến nghị

1. **Data Layer trước** — Thiết kế database schema, khởi chạy PostgreSQL + Redis
2. **User Service** — Auth là nền tảng, cần có trước mọi service khác
3. **Catalog Service** — CRUD sách + tích hợp Elasticsearch
4. **API Gateway (Nginx)** — Kết nối các service, cấu hình routing
5. **Client (Next.js)** — Xây dựng giao diện kết nối với các service
6. **Order + Payment Service** — Luồng mua hàng
7. **Kafka + Notification** — Thêm messaging async
8. **Monitoring & CI/CD** — Vận hành và tự động hoá

---

*Tài liệu này được tạo tự động. Phiên bản tech stack có thể điều chỉnh theo yêu cầu dự án.*
