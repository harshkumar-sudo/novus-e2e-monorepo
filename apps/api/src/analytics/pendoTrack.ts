/** Server-side Pendo Track Events sent to the Pendo Track API. */

export type TrackEventProperties = Record<string, string | number | boolean>;

const trackEndpoint =
  process.env.PENDO_TRACK_ENDPOINT ?? "https://data.pendo-dev.pendo-dev.com/data/track";
const trackKey = process.env.PENDO_TRACK_KEY;

/**
 * Sends a Track Event to Pendo without blocking the request. Does nothing unless
 * PENDO_TRACK_KEY (the Pendo track event integration key) is set, and never throws.
 */
export function trackServerEvent(
  eventName: string,
  visitorId: string,
  accountId: string,
  properties: TrackEventProperties
): void {
  if (!trackKey) return;
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
}
