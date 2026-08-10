# BookStore API Guide

## Table of Contents
1. [Base URL](#base-url)
2. [Authentication](#authentication)
3. [Error Handling](#error-handling)
4. [API Endpoints](#api-endpoints)
5. [Request/Response Examples](#requestresponse-examples)

---

## Base URL

```
Development: http://localhost:3000/api
Production: https://api.bookstore.com/api
```

---

## Authentication

### JWT Token

All authenticated endpoints require the `Authorization` header:

```
Authorization: Bearer {access_token}
```

### Token Structure

- **Payload**: `{ userId, email, role }`
- **Expiry**: 7 days
- **Refresh**: Available via `/auth/refresh` endpoint

---

## Error Handling

### Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description",
    "statusCode": 400,
    "timestamp": "2025-04-09T10:30:00.000Z",
    "requestId": "req_xyz123",
    "details": null
  }
}
```

### Common Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `INVALID_CREDENTIALS` | 401 | Wrong email/password |
| `UNAUTHORIZED` | 401 | Missing/invalid token |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Invalid request data |
| `DUPLICATE_EMAIL` | 409 | Email already exists |
| `INTERNAL_SERVER_ERROR` | 500 | Server error |

---

## API Endpoints

### Authentication

#### Register User
```
POST /auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "fullName": "John Doe"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "usr_123abc",
      "email": "user@example.com",
      "fullName": "John Doe",
      "createdAt": "2025-04-09T10:00:00Z"
    },
    "tokens": {
      "accessToken": "eyJhbGc...",
      "refreshToken": "eyJhbGc...",
      "expiresIn": 604800
    }
  }
}
```

#### Login
```
POST /auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc...",
    "user": {
      "id": "usr_123abc",
      "email": "user@example.com",
      "fullName": "John Doe",
      "role": "user"
    },
    "expiresIn": 604800
  }
}
```

#### Refresh Token
```
POST /auth/refresh
```

**Headers:**
```
Authorization: Bearer {refresh_token}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGc...",
    "expiresIn": 604800
  }
}
```

#### Logout
```
POST /auth/logout
```

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### Books

#### Get All Books
```
GET /books?page=1&limit=20&category=fiction&minPrice=0&maxPrice=100&sort=-createdAt
```

**Query Parameters:**
- `page` (optional): Page number, default 1
- `limit` (optional): Items per page, default 20
- `category` (optional): Filter by category
- `minPrice` (optional): Filter by minimum price
- `maxPrice` (optional): Filter by maximum price
- `sort` (optional): Sort field (use `-` for descending)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "books": [
      {
        "id": "book_001",
        "title": "Clean Code",
        "author": "Robert Martin",
        "isbn": "978-0132350884",
        "price": 45.99,
        "category": "programming",
        "description": "...",
        "coverImage": "https://cdn.bookstore.com/covers/001.jpg",
        "rating": 4.8,
        "inStock": 15,
        "createdAt": "2025-04-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "pages": 8
    }
  }
}
```

#### Get Book by ID
```
GET /books/:id
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "book_001",
    "title": "Clean Code",
    "author": "Robert Martin",
    "isbn": "978-0132350884",
    "price": 45.99,
    "category": "programming",
    "description": "...",
    "coverImage": "https://cdn.bookstore.com/covers/001.jpg",
    "rating": 4.8,
    "reviews": 342,
    "inStock": 15,
    "createdAt": "2025-04-01T00:00:00Z"
  }
}
```

#### Search Books
```
GET /books/search?q=clean%20code&page=1&size=20
```

**Query Parameters:**
- `q` (required): Search query
- `page` (optional): Page number
- `size` (optional): Results per page

**Response (200):**
```json
{
  "success": true,
  "data": {
    "books": [...],
    "total": 25,
    "page": 1,
    "size": 20
  }
}
```

---

### Orders

#### Create Order
```
POST /orders
```

**Headers:**
```
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{
  "items": [
    {
      "bookId": "book_001",
      "quantity": 2
    }
  ],
  "shippingAddress": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  },
  "paymentMethod": "stripe"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "orderId": "ord_123xyz",
    "userId": "usr_123abc",
    "status": "pending",
    "items": [
      {
        "bookId": "book_001",
        "title": "Clean Code",
        "quantity": 2,
        "unitPrice": 45.99,
        "totalPrice": 91.98
      }
    ],
    "totalAmount": 91.98,
    "shippingAddress": {...},
    "createdAt": "2025-04-09T10:30:00Z"
  }
}
```

#### Get Orders
```
GET /orders?page=1&limit=10&status=completed
```

**Headers:**
```
Authorization: Bearer {access_token}
```

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Items per page
- `status` (optional): Filter by status (pending, processing, shipped, delivered, cancelled)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "orders": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25
    }
  }
}
```

#### Get Order by ID
```
GET /orders/:id
```

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "orderId": "ord_123xyz",
    "status": "delivered",
    "items": [...],
    "totalAmount": 91.98,
    "shippingAddress": {...},
    "trackingNumber": "TRK123456789",
    "createdAt": "2025-04-09T10:30:00Z",
    "updatedAt": "2025-04-09T15:45:00Z"
  }
}
```

#### Cancel Order
```
DELETE /orders/:id
```

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Order cancelled successfully",
  "data": {
    "orderId": "ord_123xyz",
    "status": "cancelled"
  }
}
```

---

### Payments

#### Create Payment Intent
```
POST /payments/intent
```

**Headers:**
```
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{
  "orderId": "ord_123xyz",
  "amount": 9198,
  "currency": "usd"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "clientSecret": "pi_1234567890_secret_abcdef",
    "publishableKey": "pk_test_1234567890",
    "amount": 9198,
    "currency": "usd"
  }
}
```

#### Confirm Payment
```
POST /payments/confirm
```

**Headers:**
```
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{
  "orderId": "ord_123xyz",
  "paymentIntentId": "pi_1234567890",
  "paymentMethodId": "pm_1234567890"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "paymentId": "pay_123xyz",
    "orderId": "ord_123xyz",
    "status": "succeeded",
    "amount": 9198,
    "currency": "usd",
    "createdAt": "2025-04-09T10:35:00Z"
  }
}
```

---

### Users

#### Get Profile
```
GET /users/profile
```

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "usr_123abc",
    "email": "user@example.com",
    "fullName": "John Doe",
    "phone": "+1234567890",
    "avatar": "https://cdn.bookstore.com/avatars/123.jpg",
    "role": "user",
    "createdAt": "2025-04-01T00:00:00Z",
    "updatedAt": "2025-04-09T10:30:00Z"
  }
}
```

#### Update Profile
```
PUT /users/profile
```

**Headers:**
```
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{
  "fullName": "John Doe",
  "phone": "+1234567890",
  "avatar": "base64_image_data"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "usr_123abc",
    "email": "user@example.com",
    "fullName": "John Doe",
    "phone": "+1234567890",
    "updatedAt": "2025-04-09T11:00:00Z"
  }
}
```

#### Change Password
```
POST /users/change-password
```

**Headers:**
```
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{
  "currentPassword": "OldPass123!",
  "newPassword": "NewPass456!",
  "confirmPassword": "NewPass456!"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

---

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| `200` | OK - Request succeeded |
| `201` | Created - Resource created successfully |
| `204` | No Content - Request succeeded, no content returned |
| `400` | Bad Request - Invalid request data |
| `401` | Unauthorized - Missing/invalid token |
| `403` | Forbidden - No permission to access resource |
| `404` | Not Found - Resource not found |
| `409` | Conflict - Resource already exists |
| `422` | Unprocessable Entity - Validation failed |
| `429` | Too Many Requests - Rate limit exceeded |
| `500` | Internal Server Error - Server error |

---

## Best Practices

### 1. Request Format
- Use JSON format for request bodies
- Include `Content-Type: application/json` header
- UTC timezone for all timestamps

### 2. Authentication
- Always include valid JWT token in `Authorization` header
- Tokens expire after 7 days
- Use refresh token to get new access token
- Never expose tokens in URLs

### 3. Pagination
- Default page size is 20
- Maximum page size is 100
- Recommended to use cursor-based pagination for large datasets

### 4. Rate Limiting
- 30 requests per minute per IP
- 100 requests per minute per authenticated user
- Rate limit headers included in all responses

### 5. Error Handling
- Always check `success` field first
- Match error code for specific handling
- Log `requestId` for debugging
- Implement exponential backoff for retries

---

## Webhooks

### Order Status Changed
```
POST {WEBHOOK_URL}
```

**Payload:**
```json
{
  "event": "order.status_changed",
  "timestamp": "2025-04-09T10:30:00Z",
  "data": {
    "orderId": "ord_123xyz",
    "previousStatus": "pending",
    "newStatus": "processing",
    "updatedAt": "2025-04-09T10:30:00Z"
  }
}
```

### Payment Completed
```
POST {WEBHOOK_URL}
```

**Payload:**
```json
{
  "event": "payment.completed",
  "timestamp": "2025-04-09T10:35:00Z",
  "data": {
    "paymentId": "pay_123xyz",
    "orderId": "ord_123xyz",
    "amount": 9198,
    "currency": "usd",
    "status": "succeeded"
  }
}
```

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2025-04-09 | Initial API documentation |

---

**Last Updated:** April 9, 2025  
**Maintained By:** Engineering Team
