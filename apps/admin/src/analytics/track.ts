/** Browser Pendo Track Events for the admin portal. */

type TrackMetadata = Record<string, string | boolean | number>;

declare global {
  interface Window {
    pendo?: {
      track: (eventName: string, metadata?: TrackMetadata) => void;
    };
  }
}

/** Sends a Track Event through the Pendo agent, if it is loaded. Never throws. */
export function trackAdminEvent(
  eventName: string,
  metadata: Record<string, string | boolean | number | undefined>
): void {
  const defined: TrackMetadata = {};
  for (const [key, value] of Object.entries(metadata)) {
    if (value !== undefined) defined[key] = value;
  }
  try {
    window.pendo?.track(eventName, defined);
  } catch (error) {
    console.error(`Pendo track "${eventName}" failed`, error);
  }
}
