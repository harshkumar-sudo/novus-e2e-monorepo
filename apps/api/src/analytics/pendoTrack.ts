/** Server-side Pendo Track Events sent to the Pendo /data/track endpoint. */

export type TrackPropertyValue = string | number | boolean | null | undefined;

const trackEndpoint =
  process.env.PENDO_TRACK_ENDPOINT ?? "https://data.pendo-dev.pendo-dev.com/data/track";
const trackKey = process.env.PENDO_TRACK_KEY;

/**
 * Sends a Track Event to Pendo. No-ops when PENDO_TRACK_KEY is not set, and never throws:
 * tracking failures are logged and must not break the request that triggered them.
 */
export function trackServerEvent(
  eventName: string,
  visitorId: string,
  accountId: string,
  properties: Record<string, TrackPropertyValue>
): void {
  if (!trackKey) return;
  try {
    const body = {
      type: "track",
      event: eventName,
      visitorId,
      accountId,
      timestamp: Date.now(),
      properties,
    };
    void fetch(trackEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-pendo-integration-key": trackKey },
      body: JSON.stringify(body),
    })
      .then((response) => {
        if (!response.ok) {
          console.error(`Pendo track "${eventName}" failed with ${response.status}`);
        }
      })
      .catch((error: unknown) => console.error(`Pendo track "${eventName}" failed`, error));
  } catch (error) {
    console.error(`Pendo track "${eventName}" failed`, error);
  }
}
