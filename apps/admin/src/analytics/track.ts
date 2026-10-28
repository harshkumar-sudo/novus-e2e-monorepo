/** Browser Pendo Track Events for the admin portal. */

declare global {
  interface Window {
    pendo?: {
      track: (eventName: string, metadata?: Record<string, string | boolean | number>) => void;
    };
  }
}

export type AdminEventMetadata = Record<string, string | boolean | number | undefined>;

export function trackAdminEvent(eventName: string, metadata: AdminEventMetadata): void {
  const properties: Record<string, string | boolean | number> = {};
  for (const [key, value] of Object.entries(metadata)) {
    if (value !== undefined) properties[key] = value;
  }
  try {
    window.pendo?.track(eventName, properties);
  } catch {
    // Analytics must never break the admin portal.
  }
}
