/**
 * Helper to build and inspect guest invitation URLs.
 * Uses VITE_INVITE_BASE_URL when configured (e.g. for production public domains),
 * with window.location.origin as a fallback for local development.
 */

export const getPublicBaseUrl = (): string => {
  const envUrl = (import.meta.env.VITE_INVITE_BASE_URL || '').trim();
  if (envUrl) {
    return envUrl.replace(/\/+$/, '');
  }
  return typeof window !== 'undefined' ? window.location.origin : '';
};

export const getGuestInvitationUrl = (linkId: string): string => {
  return `${getPublicBaseUrl()}/home/${linkId}`;
};

export const isLocalUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    return (
      parsed.hostname === 'localhost' ||
      parsed.hostname === '127.0.0.1' ||
      parsed.hostname === '::1'
    );
  } catch {
    return false;
  }
};
