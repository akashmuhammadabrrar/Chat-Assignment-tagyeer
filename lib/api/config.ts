export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://frontend-task-chatapp.onrender.com/api";

export const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || "https://frontend-task-chatapp.onrender.com";

export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    ME: "/auth/me",
  },
  USERS: {
    SEARCH: "/users/search",
  },
  CONVERSATIONS: {
    LIST: "/conversations",
    CREATE_DIRECT: "/conversations",
    CREATE_GROUP: "/conversations/group",
    MESSAGES: (id: string) => `/conversations/${id}/messages`,
    PARTICIPANTS: (id: string) => `/conversations/${id}/participants`,
    REMOVE_PARTICIPANT: (id: string, userId: string) => `/conversations/${id}/participants/${userId}`,
    ADMINS: (id: string) => `/conversations/${id}/admins`,
    RENAME: (id: string) => `/conversations/${id}`,
  },
  MESSAGES: {
    SEND: "/messages",
  },
  SYSTEM: {
    HEALTH: "/health",
  },
} as const;
