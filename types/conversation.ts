/**
 * Conversation types — derived from live GET /conversations response.
 *
 * Response shape: { data: Conversation[] }
 *
 * Direct conversation includes a single `participant` object.
 * Group conversation includes a `name` string and a `participants` array.
 *
 * Both share `_id`, `type`, `lastMessage`, and `updatedAt`.
 */

/** The other person in a direct conversation */
export interface Participant {
  _id: string;
  name: string;
  phone: string;
}

/** Snapshot of the most recent message, embedded in the conversation list item */
export interface LastMessage {
  text: string;
  sender: string; // sender's _id
  createdAt: string; // ISO 8601
}

/** A direct (1-to-1) conversation */
export interface DirectConversation {
  _id: string;
  type: "direct";
  participant: Participant;
  lastMessage: LastMessage | null;
  updatedAt: string;
  unreadCount?: number;
}

export interface GroupConversation {
  _id: string;
  type: "group";
  name: string;
  participants: Participant[];
  admins?: string[];
  lastMessage: LastMessage | null;
  updatedAt: string;
  unreadCount?: number;
}

/** Union — sidebar renders either type */
export type Conversation = DirectConversation | GroupConversation;

/**
 * API wrapper response for GET /conversations
 * The server always wraps the array: { data: [...] }
 */
export interface ConversationsResponse {
  data: Conversation[];
}

// ─── User Search ────────────────────────────────────────────────────────────

/** A user returned from GET /users/search?q= */
export interface SearchedUser {
  _id: string;
  name: string;
  phone: string;
}

// ─── Messages ───────────────────────────────────────────────────────────────

export interface MessageSender {
  _id: string;
  name?: string;
  phone?: string;
}

export type MessageStatus = "sending" | "sent" | "seen" | "failed";

export interface Message {
  _id: string;
  conversationId: string;
  sender: MessageSender | string;
  text: string;
  createdAt: string;
  status?: MessageStatus;
  /** IDs of users who have read this message (from server) */
  readBy?: string[];
  /** Derived client-side: true if current user is in readBy */
  isSeen?: boolean;
}


