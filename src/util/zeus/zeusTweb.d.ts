/**
 * Zeus 嵌入环境下由 preload 注入的 API（window.zeusTweb）。
 * 仅在 Zeus 内嵌 Telegram A 时存在，用于上报会话状态、用户信息、主题等。
 */
export type ZeusSessionStatus = 'loading' | 'need_login' | 'ready';

export interface ZeusSessionUserChangedPayload {
  title?: string;
  username?: string;
  userId?: string | number;
  avatarPath?: string;
  avatarDataUrl?: string;
}

export interface ZeusChatItem {
  peerId: string;
  title?: string;
  unreadCount?: number;
  topMessageId?: number;
}

export interface ZeusMessageSentPayload {
  peerId: string;
  threadId?: number;
  messageId?: number;
}

export type ZeusThemeSetting = 'system' | 'day' | 'night';

export interface ZeusTwebApi {
  reportSessionStatus(status: ZeusSessionStatus): void;
  reportUserInfo(payload: ZeusSessionUserChangedPayload): void;
  reportUnreadCount(count: number): void;
  reportChatList(items: ZeusChatItem[]): void;
  reportMessageSent(payload: ZeusMessageSentPayload): void;
  reportThemeSetting(theme: ZeusThemeSetting): void;
}

declare global {
  interface Window {
    zeusTweb?: ZeusTwebApi;
  }
}

export {};
