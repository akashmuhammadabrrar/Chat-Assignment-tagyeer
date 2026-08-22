# Gossip Chat — API & WebSocket Documentation

Brief documentation of all REST API endpoints and Socket.io WebSocket events integrated into the Gossip Chat Application.

---

## Base Configuration

- **REST API Base URL**: `https://frontend-task-chatapp.onrender.com/api`
- **WebSocket (Socket.io) URL**: `https://frontend-task-chatapp.onrender.com`
- **Authentication**: Bearer Token in `Authorization` header (`Bearer <jwt>`)

---

## 1. Authentication Module

### `POST /auth/login`
Authenticates an existing user or automatically creates a new account if the phone number is new.

- **Request Body**:
  ```json
  {
    "phone": "01758472964",
    "name": "Abrrar"
  }
  ```
- **Response** (`200 OK`):
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "6a883ac4e5d6aac97522023a",
      "name": "Abrrar",
      "phone": "01758472964"
    }
  }
  ```

### `GET /auth/me`
Restores user session from stored JWT.

- **Headers**: `Authorization: Bearer <token>`
- **Response** (`200 OK`): Returns `User` object (`_id`, `name`, `phone`).

---

## 2. User Search Module

### `GET /users/search?q={query}`
Searches users by display name or phone number.

- **Query Param**: `q` (e.g. `q=Abrrar` or `q=01758472964`)
- **Note**: The client automatically strips `+` characters and tries BD/International format variations in parallel (`017...`, `88017...`, `17...`).
- **Response** (`200 OK`): `SearchedUser[]` array.

---

## 3. Conversations Module

### `GET /conversations`
Retrieves all direct and group conversations for the current user.

- **Response** (`200 OK`): `Conversation[]` array (with `type`, `participant` / `participants`, `lastMessage`, `unreadCount`).

### `POST /conversations`
Starts or opens a direct (1-to-1) conversation with another user.

- **Request Body**: `{ "userId": "<target_user_id>" }`
- **Response** (`200 OK`): `Conversation` object.

### `POST /conversations/group`
Creates a new multi-participant group conversation. Creator becomes initial Admin.

- **Request Body**:
  ```json
  {
    "name": "Project Team",
    "participantIds": ["user_id_1", "user_id_2"]
  }
  ```
- **Response** (`200 OK`): `GroupConversation` object.

---

## 4. Group Management Module

### `POST /conversations/{id}/participants`
Adds new members to an existing group (Admin only).

- **Request Body**: `{ "userIds": ["user_id_3"] }`

### `DELETE /conversations/{id}/participants/{userId}`
Removes a member from a group (Admin only) OR leaves the group (when `userId` is own ID).

### `POST /conversations/{id}/admins`
Promotes an existing group member to Admin (Admin only).

- **Request Body**: `{ "userId": "<member_id>" }`

### `PATCH /conversations/{id}`
Renames an existing group (Admin only).

- **Request Body**: `{ "name": "New Team Name" }`

---

## 5. Messages Module

### `GET /conversations/{id}/messages?limit=30&before={cursor}`
Loads message history with cursor-based pagination for older messages.

- **Query Params**:
  - `limit`: Number of messages (default `30`)
  - `before`: Cursor message ID for loading earlier history
- **Response** (`200 OK`): `Message[]` array (includes `readBy` user ID array).

### `POST /messages`
Sends a message to a conversation.

- **Request Body**:
  ```json
  {
    "conversationId": "<id>",
    "text": "Hello team!"
  }
  ```

---

## 6. WebSocket Events (Socket.io)

Connect to host root `https://frontend-task-chatapp.onrender.com` with `{ auth: { token } }`.

- **Client ➔ Server**: `message:send` (`{ conversationId, text }`)
- **Server ➔ Client**: `message:new` (Delivers incoming message payload in real-time)
- **Server ➔ Client**: `conversation:updated` (Notifies when group details/members/admins change)
