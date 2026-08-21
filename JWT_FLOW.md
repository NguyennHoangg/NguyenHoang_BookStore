# 🔐 JWT Flow — NguyenHoang BookStore

Tài liệu này mô tả toàn bộ luồng hoạt động của JWT (JSON Web Token) trong hệ thống backend, bao gồm: **đăng ký**, **đăng nhập**, **xác thực request**, **làm mới token** và **đăng xuất**.

---

## 📦 Cấu trúc file liên quan

```
be/src/
├── utils/jwt.js                  # Hàm tạo & verify token
├── services/auth.service.js      # Logic xử lý auth + Redis
├── controllers/auth.controller.js# Điều phối request/response
├── middlewares/auth.midleware.js # Bảo vệ route cần xác thực
└── routes/user.route.js          # Định nghĩa API endpoint
```

---

## 🗝️ Hai loại Token

| | Access Token | Refresh Token |
|---|---|---|
| **Mục đích** | Truy cập API | Lấy Access Token mới |
| **Thời hạn** | Ngắn (`JWT_EXPIRES_IN`) | Dài (`JWT_REFRESH_EXPIRES_IN`) |
| **Secret key** | `JWT_SECRET` | `JWT_REFRESH_SECRET` |
| **Lưu ở đâu** | Response body (client tự lưu) | `httpOnly cookie` |
| **Redis** | Blacklist khi logout | Lưu để verify khi refresh |

### Hàm tạo token — `utils/jwt.js`

```js
// Access Token: ký bằng JWT_SECRET
const generateAccessToken = (payload, expiresIn = '1h') => {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

// Refresh Token: ký bằng JWT_REFRESH_SECRET (secret khác!)
const generateRefreshToken = (payload, expiresIn = '7d') => {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn });
};
```

---

## 1️⃣ ĐĂNG KÝ — `POST /api/auth/register`

```
Client → POST /api/auth/register
         { identifier, password, fullname }
                    ↓
         register() → validate → hash password → lưu DB
                    ↓
         201 Created { success: true }
```

### Code — `auth.service.js`

```js
const register = async (identifier, password, fullname) => {
  // Kiểm tra tài khoản đã tồn tại chưa
  const existingAccount = await findByCredential(identifier);
  if (existingAccount) {
    throw createError(HTTP_STATUS.CONFLICT, AUTH_ERRORS.AUTH_ALLREADY_EXISTS);
  }

  // Hash password với bcrypt (10 rounds)
  const passwordHash = await bcrypt.hash(password, 10);
  const accountId = generateAccountId();
  const userId = generateUserId();

  const userData = { userId, accountId, identifier, passwordHash, fullname };
  const newUser = await createUser(userData);
  return newUser;
};
```

---

## 2️⃣ ĐĂNG NHẬP — `POST /api/auth/login`

```
Client → POST /api/auth/login
         { email, password }
                    ↓
         ┌─ Kiểm tra login attempts trong Redis
         │  Nếu >= 5 lần → 429 Too Many Requests (khóa 15 phút)
         ↓
         findByCredential(email) → tìm trong DB
         Nếu không có → tăng attempts + 401
                    ↓
         bcrypt.compare(password, hash)
         Nếu sai → 401 Unauthorized
                    ↓
         Tạo accessToken + refreshToken
                    ↓
         Lưu refreshToken vào Redis (7 ngày)
                    ↓
         Set refreshToken vào httpOnly cookie
                    ↓
         200 OK { data: userInfo, token: { accessToken } }
```

### Code — `auth.controller.js`

```js
const loginController = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await login(email, password); // xác thực trong DB

  // Tạo cả 2 token với payload: { userid, role }
  const accessToken = jwtUtil.generateAccessToken(
    { userid: user.userid, role: user.role },
    process.env.JWT_EXPIRES_IN,
  );
  const refreshToken = jwtUtil.generateRefreshToken(
    { userid: user.userid, role: user.role },
    process.env.JWT_REFRESH_EXPIRES_IN,
  );

  // Lưu refresh token vào Redis: key = "auth:refresh:<userId>"
  await saveRefreshToken(user.userid, refreshToken);

  // Gửi refresh token qua httpOnly cookie (JS không đọc được)
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày (ms)
  });

  res.status(200).json({
    success: true,
    data: { id: user.userid, email: user.email, role: user.role /* ... */ },
    token: { accessToken, expiresIn: process.env.JWT_EXPIRES_IN },
  });
};
```

### Code — `auth.service.js` (login attempts + xác thực)

```js
const login = async (email, password) => {
  // Rate limit: kiểm tra số lần đăng nhập sai
  const attemptsKey = CACHE_KEYS.LOGIN_ATTEMPTS(email); // "auth:login_attempts:<email>"
  const attemps = await redisCache.get(attemptsKey);

  if (parseInt(attemps) >= MAX_LOGIN_ATTEMPTS) {  // MAX = 5
    throw createError(HTTP_STATUS.TOO_MANY_REQUESTS, "Khóa 15 phút...");
  }

  const account = await findByCredential(email);
  if (!account) {
    await redisCache.increaseLoginAttempts(email, LOCK_OUT_TIME); // +1 attempt
    throw createError(HTTP_STATUS.UNAUTHORIZED, AUTH_ERRORS.INVALID_CREDENTIALS);
  }

  const isMatch = await bcrypt.compare(password, account.passwordhash);
  if (!isMatch) {
    throw createError(HTTP_STATUS.UNAUTHORIZED, AUTH_ERRORS.INVALID_CREDENTIALS);
  }

  await updateLastLoginAt(account.accountid);
  return account;
};

// Lưu refresh token vào Redis
const saveRefreshToken = async (userId, refreshToken) => {
  const key = CACHE_KEYS.REFRESH_TOKEN(userId); // "auth:refresh:<userId>"
  await redisCache.set(key, refreshToken, REFRESH_TOKEN_TTL); // TTL = 7 ngày
};
```

---

## 3️⃣ XÁC THỰC REQUEST — Middleware

Mọi route cần bảo vệ đều đi qua `authMiddleware` trước.

```
Client → GET /api/books (có header: Authorization: Bearer <accessToken>)
                    ↓
         authMiddleware
         ├─ Không có token → 401
         ├─ Token trong Redis blacklist? → 401 (đã logout)
         ├─ jwt.verify(token, JWT_SECRET) thất bại → 401
         └─ OK → gán req.user = decoded → next()
                    ↓
         bookController xử lý request
```

### Code — `auth.midleware.js`

```js
const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer <token>"

  if (!token) {
    throw createError(HTTP_STATUS.UNAUTHORIZED, 'Unauthorized: No token provided');
  }

  // Kiểm tra token có trong blacklist không (đã bị revoke khi logout)
  const isBlocked = await isTokenBlacklisted(token);
  if (isBlocked) {
    throw createError(HTTP_STATUS.UNAUTHORIZED, 'Unauthorized: Token has been revoked');
  }

  try {
    // Verify chữ ký và hạn dùng
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded; // { userid, role, iat, exp }
    next();
  } catch (err) {
    throw createError(HTTP_STATUS.UNAUTHORIZED, 'Unauthorized: Invalid token');
  }
};
```

### Cấu hình route — `user.route.js`

```js
// Public: không cần token
router.post("/login",    loginController);
router.post("/register", registerController);
router.post("/refresh",  refreshTokenController);

// Protected: phải qua authMiddleware trước
router.post("/logout", authMiddleware, logoutController);
```

---

## 4️⃣ LÀM MỚI TOKEN — `POST /api/auth/refresh`

Khi access token hết hạn, client gọi endpoint này. Refresh token được gửi **tự động** qua cookie (không cần client tự đính kèm).

```
Client → POST /api/auth/refresh  (kèm cookie: refreshToken=<...>)
                    ↓
         refreshAccessToken(refreshToken)
         ├─ Không có cookie → 401
         ├─ jwt.verify(token, JWT_REFRESH_SECRET) thất bại → 401
         ├─ So sánh với Redis ("auth:refresh:<userId>"):
         │   Không khớp / đã bị xóa (logout) → 401
         └─ OK → tạo accessToken mới
                    ↓
         200 OK { token: { accessToken, expiresIn } }
```

### Code — `auth.service.js`

```js
const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) {
    throw createError(HTTP_STATUS.UNAUTHORIZED, AUTH_ERRORS.REFRESH_TOKEN_INVALID);
  }

  let decoded;
  try {
    // Verify bằng JWT_REFRESH_SECRET (khác với access token)
    decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  } catch (err) {
    throw createError(HTTP_STATUS.UNAUTHORIZED, AUTH_ERRORS.REFRESH_TOKEN_INVALID);
  }

  // Bảo vệ thêm: so khớp với token đang lưu trong Redis
  // Nếu user đã logout → Redis đã xóa → không thể refresh
  const storedToken = await redisCache.get(CACHE_KEYS.REFRESH_TOKEN(decoded.userid));
  if (!storedToken || storedToken !== refreshToken) {
    throw createError(HTTP_STATUS.UNAUTHORIZED, AUTH_ERRORS.REFRESH_TOKEN_INVALID);
  }

  // Cấp access token mới
  const newAccessToken = jwtUtil.generateAccessToken(
    { userid: decoded.userid, role: decoded.role },
    process.env.JWT_EXPIRES_IN,
  );

  return { accessToken: newAccessToken, expiresIn: process.env.JWT_EXPIRES_IN };
};
```

### Code — `auth.controller.js`

```js
const refreshTokenController = async (req, res, next) => {
  // Cookie httpOnly → trình duyệt tự gửi, client không cần xử lý thêm
  const refreshToken = req.cookies?.refreshToken;

  const result = await refreshAccessToken(refreshToken);

  res.status(200).json({ success: true, token: result });
};
```

---

## 5️⃣ ĐĂNG XUẤT — `POST /api/auth/logout`

```
Client → POST /api/auth/logout
         Header: Authorization: Bearer <accessToken>
                    ↓
         authMiddleware (verify access token trước)
                    ↓
         logoutController
         ├─ Tính TTL còn lại của access token
         ├─ Lưu access token vào Redis blacklist (TTL = thời gian còn lại)
         ├─ Xóa refresh token khỏi Redis
         └─ Xóa cookie refreshToken phía client
                    ↓
         200 OK { message: "Đăng xuất thành công" }
```

### Code — `auth.controller.js`

```js
const logoutController = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const accessToken = authHeader && authHeader.split(" ")[1];

  // Tính thời gian còn lại để đặt TTL cho blacklist
  // (Token tự xóa khỏi Redis khi hết hạn — không tốn bộ nhớ mãi mãi)
  let accessTokenTTL = 60 * 15; // fallback 15 phút
  const decoded = jwt.decode(accessToken);
  if (decoded?.exp) {
    const remaining = decoded.exp - Math.floor(Date.now() / 1000);
    if (remaining > 0) accessTokenTTL = remaining;
  }

  const userId = req.user?.userid; // từ authMiddleware

  await logout(accessToken, accessTokenTTL, userId);

  // Xóa cookie phía client
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.status(200).json({ success: true, message: "Đăng xuất thành công" });
};
```

### Code — `auth.service.js`

```js
const logout = async (accessToken, accessTokenTTL, userId) => {
  // 1. Blacklist access token → mọi request dùng token này đều bị từ chối
  const blacklistKey = CACHE_KEYS.TOKEN_BLACKLIST(accessToken); // "auth:blacklist:<token>"
  await redisCache.set(blacklistKey, "1", accessTokenTTL);

  // 2. Xóa refresh token → user không thể lấy access token mới nữa
  if (userId) {
    const refreshKey = CACHE_KEYS.REFRESH_TOKEN(userId); // "auth:refresh:<userId>"
    await redisCache.del(refreshKey);
  }
};
```

---

## 🗄️ Redis Keys Summary

| Key pattern | Giá trị | TTL | Mục đích |
|---|---|---|---|
| `auth:login_attempts:<email>` | số nguyên (1-5) | 15 phút | Rate limit đăng nhập |
| `auth:refresh:<userId>` | refreshToken string | 7 ngày | Lưu refresh token hợp lệ |
| `auth:blacklist:<accessToken>` | `"1"` | Thời gian còn lại của token | Vô hiệu hóa token sau logout |

---

## 🔄 Sơ đồ tổng quan

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT                                   │
│  Lưu: accessToken (memory/localStorage)                         │
│  Cookie: refreshToken (httpOnly, tự động gửi)                   │
└──────────┬──────────────────────────────────────────────────────┘
           │
     ┌─────▼──────┐    POST /api/auth/login
     │   LOGIN    │ ──────────────────────────────────────────────►
     └────────────┘    ◄── { accessToken } + Set-Cookie: refreshToken

     ┌─────▼──────┐    GET/POST /api/* + Authorization: Bearer <accessToken>
     │  API CALL  │ ──────────────────────────────────────────────►
     └────────────┘    authMiddleware: verify + blacklist check
                       ◄── Response data

     ┌─────▼──────┐    POST /api/auth/refresh  (accessToken hết hạn)
     │  REFRESH   │ ──────────────────────────────────────────────►
     └────────────┘    Cookie tự gửi refreshToken
                       ◄── { accessToken mới }

     ┌─────▼──────┐    POST /api/auth/logout + Authorization: Bearer <accessToken>
     │   LOGOUT   │ ──────────────────────────────────────────────►
     └────────────┘    Blacklist accessToken + xóa refreshToken Redis
                       ◄── { message: "Đăng xuất thành công" } + Clear-Cookie
```

---

## ⚙️ Biến môi trường cần thiết (`.env`)

```env
JWT_SECRET=your_access_token_secret_key
JWT_REFRESH_SECRET=your_refresh_token_secret_key
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
NODE_ENV=development
```

> **Lưu ý:** `JWT_SECRET` và `JWT_REFRESH_SECRET` phải là **hai giá trị khác nhau** để tránh dùng lẫn lộn giữa 2 loại token.
