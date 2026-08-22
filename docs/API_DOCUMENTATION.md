# Gossip Chat API Documentation

## Base Configuration

- **REST API Base URL**: `https://frontend-task-chatapp.onrender.com/api`
- **WebSocket (Socket.io) URL**: `https://frontend-task-chatapp.onrender.com`
- **Content-Type**: `application/json`

---

## 1. Authentication Module

### `POST /auth/login`
Logs in an existing user or automatically registers a new user if the phone number is not found.

#### Request Headers
```http
Content-Type: application/json
Accept: application/json
```

#### Request Body
| Field | Type | Required | Description |
|---|---|---|---|
| `phone` | `string` | **Yes** | User's unique phone number (e.g. `"01758472964"`) |
| `name` | `string` | **Yes** | User's display name (e.g. `"Abrrar"`) |

```json
{
  "phone": "01758472964",
  "name": "Abrrar"
}
```

#### Success Response (`200 OK`)
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "6a883ac4e5d6aac97522023a",
    "name": "Abrrar",
    "phone": "01758472964",
    "createdAt": "2026-08-21T11:47:16.537Z"
  }
}
```

---

### `GET /auth/me`
Retrieves the current authenticated user's profile associated with the Bearer token.

#### Request Headers
```http
Authorization: Bearer <token>
Accept: application/json
```

#### Success Response (`200 OK`)
```json
{
  "_id": "6a883ac4e5d6aac97522023a",
  "name": "Abrrar",
  "phone": "01758472964",
  "createdAt": "2026-08-21T11:47:16.537Z"
}
```
