/** Browser AI research assistant events. Never include prompt or reply text. */

export interface AssistantResponseMetadata {
  outcome: "success" | "failure";
  model?: string;
  messageCount: number;
  conversationTurn: number;
  latencyMs: number;
  replyLength?: number;
  errorMessage?: string;
  statusCode?: number;
}

/** Fires once per assistant request, after api.askAssistant resolves or throws. */
export function trackAssistantResponseReceived(metadata: AssistantResponseMetadata): void {
  const properties: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(metadata)) {
    if (value !== undefined) properties[key] = value;
  }
  try {
    window.pendo?.track("assistant_response_received", properties);
  } catch {
    // Analytics must never break the assistant panel.
  }
}
