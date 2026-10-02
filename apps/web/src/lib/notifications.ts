export interface NotificationPayload {
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
}

export function notifyUser(type: 'success' | 'error' | 'info' | 'warning', title: string, message: string) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent<NotificationPayload>('academic_portal_notify', {
        detail: { type, title, message },
      })
    );
  }
}
