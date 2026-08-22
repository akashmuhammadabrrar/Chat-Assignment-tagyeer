# Gossip — Real-Time Team Chat Platform

A modern, high-performance real-time messaging web application built with **Next.js 16 (App Router)**, **Redux Toolkit**, **TanStack Query**, and **Socket.io**.

Gossip is designed for seamless **1-on-1 direct conversations** and **multi-participant group workspaces**, with a focus on real-time communication, responsive UI, efficient state management, and a smooth user experience.

---

## Live Demos

### Part 1 — Implemented Chat Application

**Live Application:**
https://chatgossip.netlify.app/chat

### Part 2 — Landing Page

**Live Landing Page:**
https://chatgossip.netlify.app/

---

## Key Features

* **Instant Authentication**: Single-step login and automatic registration using phone number and name.
* **1-on-1 & Group Chats**: Create direct conversations or group workspaces with custom names and member selection.
* **Group Admin Tools**: Promote members to Admin, rename groups inline, and add or remove participants.
* **Real-Time Messaging**: Socket.io WebSockets for instant message delivery and live conversation updates.
* **Message Pagination**: Cursor-based pagination using the `before` parameter with scroll-position restoration.
* **Delivery & Seen Ticks**: Visual message states including `sending`, `sent`, and `seen`.
* **Unread Badges & Indicators**: Unread message counters and visual hints for conversations with unread messages.
* **Smart Search**: Search users by name or phone number with support for Bangladeshi and international phone-number formats.
* **Dark & Light Themes**: Theme switching powered by `next-themes` with persistent local theme preference.
* **Responsive UI**: Responsive layouts designed for desktop and smaller screens.
* **Modern Visual Design**: Glassmorphism, Framer Motion animations, spring-based interactions, and smooth micro-interactions.

---

## Tech Stack

| Domain                      | Technology               |
| --------------------------- | ------------------------ |
| **Framework**               | Next.js 16 (App Router)  |
| **Language**                | TypeScript               |
| **State Management**        | Redux Toolkit            |
| **Server State & Caching**  | TanStack Query v5        |
| **Real-Time Communication** | Socket.io Client         |
| **Styling**                 | Tailwind CSS v4          |
| **Icons**                   | Lucide React             |
| **Animations**              | Framer Motion            |
| **Theme Management**        | `next-themes`            |
| **Typography**              | Google Fonts — Quicksand |
| **API Communication**       | Axios / Fetch            |

---

## Part 3 — Technical Write-up

### Architecture & State Management

The application separates client-side UI state from server-side data state.

**Redux Toolkit** is used for global application state such as:

* Authentication state
* Selected conversation state
* UI-related state

The Redux store is divided into focused slices such as:

* `authSlice`
* `chatSlice`
* `uiSlice`

For server-side data, **TanStack Query v5** manages fetching, caching, synchronization, loading states, and mutation handling.

This separation keeps the application predictable and avoids using Redux for data that is better managed as server state.

---

### Real-Time Communication

Real-time communication is implemented using **Socket.io**.

The client maintains a Socket.io connection through the `useSocket` custom hook and listens for events such as:

* `message:new`
* `conversation:updated`

This allows newly sent messages and conversation changes to appear immediately without requiring a manual page refresh.

The Socket.io instance is stored using `useRef` so that the connection can persist across renders without causing unnecessary component re-renders.

---

### Message Pagination

Conversation history uses **cursor-based pagination** rather than loading the entire message history at once.

Older messages are requested using the `before` cursor.

When older messages are prepended to the message list, the application stores the previous scroll height and calculates the difference after new messages are inserted. This allows the user's scroll position to remain stable instead of jumping unexpectedly.

This approach improves both performance and user experience for conversations containing large message histories.

---

### Optimistic Messaging

Message sending is handled through the custom message hooks, including `useMessages` and `useSendMessage`.

The UI can immediately represent the message as being sent before the server response is fully processed.

The message status can then progress through states such as:

```text
sending → sent → seen
```

This provides immediate feedback to the user while maintaining synchronization with the backend.

---

### Custom Hooks Architecture

Application logic is organized into reusable custom hooks to keep components focused on presentation.

#### `useAuth`

Responsible for:

* Login
* Automatic registration
* Session restoration
* Logout

#### `useConversations`

Responsible for:

* Fetching conversations
* Caching conversation data
* Synchronizing conversation state

#### `useMessages`

Responsible for:

* Loading messages
* Managing message state
* Sending messages
* Optimistic updates

#### `useLoadMoreMessages`

Responsible for:

* Loading older messages
* Cursor-based pagination
* Maintaining scroll position

#### `useGroupActions`

Encapsulates group-related mutations such as:

* Promote member to Admin
* Rename group
* Add members
* Remove members

#### `useSocket`

Responsible for:

* Socket connection lifecycle
* Event listeners
* Cleanup
* Real-time message and conversation updates

---

## React Hooks Usage

### `useMemo`

`useMemo` is used where derived values should be recalculated only when their dependencies change.

Examples include:

* `activeUsers` in `chat-sidebar.tsx`
* `headerInfo` in `ChatPage`
* Stable derived values returned by custom hooks

This helps avoid unnecessary calculations during repeated renders.

---

### `useCallback`

`useCallback` is used for event handlers and functions passed to child components.

Examples include:

* `scrollToBottom`
* `handleScroll`
* Group-management event handlers
* Member-management event handlers

This helps maintain stable function references when appropriate.

---

### `useRef`

`useRef` is used for mutable values that should persist between renders without triggering a re-render.

Examples include:

* `socketRef` in `useSocket`
* `messagesContainerRef`
* `messagesEndRef`
* `prevScrollHeightRef`

These references are particularly important for Socket.io lifecycle management and message-list scrolling behavior.

---

## Performance Considerations

Several implementation decisions were made to keep the application responsive:

* Cursor-based message pagination instead of loading complete conversation history.
* TanStack Query caching for server state.
* Memoized derived values with `useMemo`.
* Stable callback references with `useCallback`.
* Persistent DOM and socket references with `useRef`.
* Optimistic message handling for faster perceived response time.
* Reusable custom hooks to isolate logic and avoid unnecessary component complexity.

---

## Directory Structure

```text
chat-app/
├── app/
│   ├── chat/                  # Main chat application
│   ├── login/                 # Login / registration page
│   ├── layout.tsx             # Root layout and providers
│   └── page.tsx               # Animated landing page
│
├── components/
│   ├── chat/
│   │   ├── header/            # Chat header components
│   │   ├── sidebar/           # Sidebar, search, contacts, footer
│   │   ├── conversations/     # Conversation items and group modal
│   │   ├── messages/          # Message list, message item, input
│   │   └── group-details/     # Group details and member management
│   │
│   ├── ui/                    # Reusable UI primitives
│   ├── navbar.tsx             # Responsive glassmorphism navbar
│   └── footer.tsx             # Landing page footer
│
├── hooks/                     # Custom React hooks
│
├── lib/
│   ├── api/                   # API clients and endpoint modules
│   └── redux/                 # Redux store and slices
│
└── types/                     # TypeScript interfaces and types
```

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/akashmuhammadabrrar/Chat-Assignment-tagyeer.git
cd Chat-Assignment-tagyeer
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create `.env.local`

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_URL=https://frontend-task-chatapp.onrender.com/api
NEXT_PUBLIC_SOCKET_URL=https://frontend-task-chatapp.onrender.com
```

### 4. Run the Development Server

```bash
npm run dev
```

Open:

http://localhost:3000

### 5. Verify TypeScript

```bash
npx tsc --noEmit
```

### 6. Create a Production Build

```bash
npm run build
```

---

## Production Deployment

The frontend is deployed on **Netlify**, while the backend API and Socket.io server are hosted on **Render**.

### Frontend

**Netlify:**
https://chatgossip.netlify.app/

### Backend

**Render API:**
https://frontend-task-chatapp.onrender.com

The frontend communicates with the deployed backend through the following environment variables:

```env
NEXT_PUBLIC_API_URL=https://frontend-task-chatapp.onrender.com/api
NEXT_PUBLIC_SOCKET_URL=https://frontend-task-chatapp.onrender.com
```

---

## Type Safety

TypeScript was used throughout the project to provide strong typing for:

* Conversations
* Messages
* Authentication data
* Group members
* API responses
* Component props
* Custom hook return values

The project was verified using:

```bash
npx tsc --noEmit
```

---

## Author

**Akash Muhammad Abrrar**

GitHub:
https://github.com/akashmuhammadabrrar
