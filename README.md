# Gossip — Real-Time Team Chat Platform

A modern, high-performance real-time messaging web application built with **Next.js 16 (App Router)**, **Redux Toolkit**, **TanStack Query**, and **Socket.io**. Designed for seamless 1-on-1 direct conversations and multi-participant group workspaces.

---

##  Key Features

-  **Instant Auth**: Single-step Login & Automatic Registration with phone number and name.
-  **1-on-1 & Group Chats**: Create direct chats or group workspaces with custom names and member selection.
-  **Group Admin Tools**: Promote members to Admin, rename groups inline, and add/remove participants.
-  **Real-Time Messaging**: Socket.io WebSockets for instant message delivery and live group updates.
-  **Message Pagination**: Cursor-based pagination (`before` parameter) with scroll-position restoration.
-  **Delivery & Seen Ticks**: Visual indicators (`sending` ➔ `sent` ➔ `seen` green double-check).
-  **Unread Badges & Bold Hints**: Highlighted unread messages and unread counter badges.
-  **Smart Phone & Name Search**: Sanitized search with automatic BD & International phone format resolution.
-  **Dark & Light Mode Themes**: Built-in Theme Switcher (`ThemeToggle`) powered by `next-themes` with full semantic design tokens for light mode (`#FFEED6`, `#9A9C57`, `#FAFD8F`) and dark mode (`#0D100B`, `#171914`, `#FAFD8F`). Hydration-safe with local storage theme preference persistence.
-  **Modern Design & Glassmorphism**: Translucent scroll-responsive glass navbar, Framer Motion spring pop-ups, and smooth micro-interactions.

---

## Tech Stack

| Domain | Technology |
|---|---|
| **Typography** | Google Fonts (**Quicksand** via `next/font/google`) |
| **Theme & Dark Mode** | `next-themes` (`ThemeToggle`, Light/Dark semantic tokens) |
| **State Management** | Redux Toolkit (`authSlice`, `chatSlice`, `uiSlice`) |
| **Server State & Caching** | TanStack Query v5 (React Query) |
| **Real-Time WebSockets** | Socket.io Client |
| **Styling & Icons** | Tailwind CSS v4, Lucide React Icons |
| **Animations** | Framer Motion (Spring pop-ups & fluid transitions) |
| **Type Safety** | TypeScript (`npx tsc --noEmit` verified) |

---

##  React Hooks Usage Explanation

Here is a clear overview of how React hooks are leveraged throughout the codebase:

### 1. `useMemo`
- **Purpose**: Caches expensive calculations between renders so they only compute when dependencies change.
- **Where Used**:
  - `activeUsers` in `chat-sidebar.tsx`: Derives unique online contacts from active conversations in $O(n)$ time.
  - `headerInfo` in `ChatPage`: Computes avatar initials and subtitle labels for selected chats.
  - Custom hooks (`useMessages`, `useSendMessage`, `useGroupActions`): Returns stable object references to prevent unnecessary component re-renders.

### 2. `useCallback`
- **Purpose**: Returns memoized function references to prevent child components from re-rendering when props are passed down.
- **Where Used**:
  - `scrollToBottom` & `handleScroll` in `ChatPage` and `MessageList`.
  - Event handlers in `GroupDetailsModal` and `AddMembersTab`.

### 3. `useRef`
- **Purpose**: Stores mutable values that persist across renders without causing re-renders (DOM nodes, socket instances, scroll positions).
- **Where Used**:
  - `socketRef` in `useSocket`: Holds the active Socket.io instance for event cleanup.
  - `messagesContainerRef` & `messagesEndRef`: Controls auto-scroll and restores scroll position after loading older messages.
  - `prevScrollHeightRef` in `MessageList`: Computes scroll delta when prepending paginated messages.

### 4. Custom Hooks Architecture
- `useAuth`: Manages login, session restore via `/auth/me`, and logout.
- `useConversations`: Fetches and caches conversation list using TanStack Query.
- `useMessages` & `useLoadMoreMessages`: Handles message history loading, optimistic sending, and cursor pagination.
- `useGroupActions`: Encapsulates group mutations (`promoteToAdmin`, `renameGroup`, `removeMember`).
- `useSocket`: Manages WebSocket lifecycle, listening to `message:new` and `conversation:updated`.

---

##  Directory Structure

```
chat-app/
├── app/
│   ├── chat/              # Main chat page
│   ├── login/             # Login / registration page
│   ├── layout.tsx         # Root layout & providers
│   └── page.tsx           # Animated landing page
├── components/
│   ├── chat/
│   │   ├── header/        # ChatHeader component
│   │   ├── sidebar/       # ChatSidebar, search, contacts, footer
│   │   ├── conversations/ # ConversationItem, skeleton, group modal
│   │   ├── messages/      # MessageList, MessageItem, MessageInput
│   │   └── group-details/ # GroupDetailsModal, member item, rename form
│   ├── ui/                # Button, Container reusable primitives
│   ├── navbar.tsx         # Responsive navbar with glassmorphism
│   └── footer.tsx         # Responsive landing page footer
├── hooks/                 # Custom React hooks
├── lib/
│   ├── api/               # Axios/Fetch client & API endpoint modules
│   └── redux/             # Redux store & slices
└── types/                 # TypeScript interfaces (Conversation, Message)
```

---

##  Getting Started

1. **Clone & Install Dependencies**:
   ```bash
   git clone <repository_url>
   cd chat-app
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

3. **Verify Type Safety & Build**:
   ```bash
   npx tsc --noEmit  # TypeScript check
   npm run build     # Next.js production build
   ```

---

## 🚀 Deploying to Vercel

Deploying this Next.js 16 app to Vercel is super simple:

### Option A: Via GitHub / Vercel Dashboard (Recommended)

1. Push your repository to GitHub:
   ```bash
   git add .
   git commit -m "Deploy commit"
   git push origin main
   ```
2. Go to [vercel.com/new](https://vercel.com/new).
3. Import your GitHub repository (`Chat-Assignment-tagyeer`).
4. Keep all default settings:
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
5. Click **Deploy**. Vercel will build and host your site automatically with zero extra configuration!

### Option B: Via Vercel CLI

1. Install Vercel CLI globally:
   ```bash
   npm i -g vercel
   ```
2. Login to your Vercel account:
   ```bash
   vercel login
   ```
3. Run deploy command from project root:
   ```bash
   vercel --prod
   ```

