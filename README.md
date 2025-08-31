# Bookstore OTP + JWT Authentication API

This project implements OTP-based authentication with JWT access/refresh tokens and book CRUD APIs using **Node.js**, **Express.js**, and **SQLite**.

---

## 🚀 Setup Instructions

1. Clone the repo
   ```bash
   git clone https://github.com/<your-username>/<repo-name>.git
   cd <repo-name>
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start server
   ```bash
   npm run dev
   ```

---

## 📌 API Documentation

### 1. Generate OTP

**POST** `/api/auth/generate-otp`

Request:
```json
{ "email": "user@example.com" }
```

Response:
```json
{ "message": "OTP sent successfully" }
```

---

### 2. Verify OTP (Get Tokens)

**POST** `/api/auth/verify-otp`

Request:
```json
{ "email": "user@example.com", "otp": "123456" }
```

Response:
```json
{
  "accessToken": "xxxxx.yyyyy.zzzzz",
  "refreshToken": "aaaaa.bbbbb.ccccc"
}
```

---

### 3. Refresh Token

**POST** `/api/auth/refresh-token`

Request:
```json
{ "refreshToken": "aaaaa.bbbbb.ccccc" }
```

Response:
```json
{ "accessToken": "new.xxxxx.zzzzz" }
```

---

### 4. Create Book (Protected)

**POST** `/api/books`

Headers:
```
Authorization: Bearer <accessToken>
```

Request:
```json
{ "title": "Node.js Guide", "author": "John Doe" }
```

Response:
```json
{
  "id": 1,
  "title": "Node.js Guide",
  "author": "John Doe"
}
```

---

### 5. Get Books (Protected)

**GET** `/api/books`

Headers:
```
Authorization: Bearer <accessToken>
```

Response:
```json
[
  { "id": 1, "title": "Node.js Guide", "author": "John Doe" }
]
```

---

## 🔄 OTP + JWT Flow

1. **Generate OTP** → `/generate-otp`
2. **Verify OTP** → Receive **accessToken + refreshToken**
3. Use **accessToken** in headers → CRUD Books
4. When expired → **refresh** using `/refresh-token`

---

## 🧪 Postman Collection

A ready-to-use Postman collection is included in this repo:
📂 `postman_collection.json`

Import it into Postman and test all APIs.

---

## 👨‍💻 Tech Stack

* Node.js
* Express.js
* SQLite
* JWT
* Postman
