/**
 * Centralized API Configuration & Feature Endpoint Registry for Gossip
 */

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";

export const ENDPOINTS = {
  // Authentication & Session
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
    REFRESH: `${API_BASE_URL}/auth/refresh`,
    ME: `${API_BASE_URL}/auth/me`,
  },

  // User Profiles & Status
  USERS: {
    BASE: `${API_BASE_URL}/users`,
    PROFILE: (userId: string) => `${API_BASE_URL}/users/${userId}`,
    UPDATE_STATUS: `${API_BASE_URL}/users/status`,
    SEARCH: `${API_BASE_URL}/users/search`,
  },

  // Channels & Workspaces
  CHANNELS: {
    BASE: `${API_BASE_URL}/channels`,
    DETAIL: (channelId: string) => `${API_BASE_URL}/channels/${channelId}`,
    JOIN: (channelId: string) => `${API_BASE_URL}/channels/${channelId}/join`,
    LEAVE: (channelId: string) => `${API_BASE_URL}/channels/${channelId}/leave`,
    MEMBERS: (channelId: string) => `${API_BASE_URL}/channels/${channelId}/members`,
  },

  // Messages & Reactions
  MESSAGES: {
    CHANNEL_MESSAGES: (channelId: string) =>
      `${API_BASE_URL}/channels/${channelId}/messages`,
    DIRECT_MESSAGES: (recipientId: string) =>
      `${API_BASE_URL}/messages/direct/${recipientId}`,
    SEND: `${API_BASE_URL}/messages`,
    REACT: (messageId: string) => `${API_BASE_URL}/messages/${messageId}/reactions`,
    DELETE: (messageId: string) => `${API_BASE_URL}/messages/${messageId}`,
  },

  // File Uploads & Attachments
  MEDIA: {
    UPLOAD: `${API_BASE_URL}/media/upload`,
  },
} as const;
