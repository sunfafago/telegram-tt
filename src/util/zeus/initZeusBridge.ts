/**
 * Zeus 桥接：当运行在 Zeus 内嵌环境（window.zeusTweb 存在）时，
 * 监听全局状态变化并上报会话状态、用户信息、主题设置、未读数等。
 */
import { addCallback } from '../../lib/teact/teactn';
import { getGlobal } from '../../global';
import { selectSharedSettings } from '../../global/selectors/sharedState';
import { selectTheme } from '../../global/selectors/ui';
import { selectUser } from '../../global/selectors/users';
import { getUserFullName } from '../../global/helpers/users';
import { getAllNotificationsCount } from '../folderManager';
import type { ZeusThemeSetting } from './zeusTweb';

function getZeusTweb() {
  return typeof window !== 'undefined' ? window.zeusTweb : undefined;
}

function mapThemeToZeus(theme: 'light' | 'dark', shouldUseSystemTheme: boolean): ZeusThemeSetting {
  if (shouldUseSystemTheme) return 'system';
  return theme === 'light' ? 'day' : 'night';
}

function reportToZeus() {
  const zeus = getZeusTweb();
  if (!zeus) return;

  const global = getGlobal();
  const authState = global.auth?.state;
  const currentUserId = global.currentUserId;
  const settings = selectSharedSettings(global);
  const theme = selectTheme(global);

  const status = authState === 'authorizationStateReady' ? 'ready' : (currentUserId ? 'loading' : 'need_login');
  zeus.reportSessionStatus(status);

  const zeusTheme = mapThemeToZeus(theme, settings.shouldUseSystemTheme);
  zeus.reportThemeSetting(zeusTheme);

  const unreadCount = getAllNotificationsCount();
  zeus.reportUnreadCount(unreadCount);

  if (currentUserId && authState === 'authorizationStateReady') {
    const user = selectUser(global, currentUserId);
    const title = user ? getUserFullName(user) : undefined;
    const username = user?.usernames?.find((u) => u.isActive)?.username ?? user?.usernames?.[0]?.username;
    zeus.reportUserInfo({
      title,
      username,
      userId: currentUserId,
    });
  }
}

export default function initZeusBridge() {
  if (!getZeusTweb()) return;

  reportToZeus();
  addCallback(reportToZeus);
}
