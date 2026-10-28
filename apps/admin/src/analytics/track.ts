/** Browser Pendo Track Events for the admin portal. */

declare global {
  interface Window {
    pendo?: {
      track: (eventName: string, metadata?: Record<string, string | boolean | number>) => void;
    };
  }
}

export function trackAdminEvent(
  eventName: string,
  metadata: Record<string, string | boolean | number>
): void {
  window.pendo?.track(eventName, metadata);
}
