/** Pendo Agent Analytics events for the Fieldnotes research assistant. */

export const RESEARCH_ASSISTANT_AGENT_ID = "f5DmwM-puQgnDwZ_bPFaMpz-WH8";

export type AgentEventType = "prompt" | "agent_response" | "user_reaction";

export interface AgentEventMetadata {
  conversationId: string;
  messageId: string;
  content: string;
  modelUsed?: string;
  suggestedPrompt?: boolean;
  toolsUsed?: string[];
  fileUploaded?: boolean;
}

export function trackResearchAssistantEvent(
  eventType: AgentEventType,
  metadata: AgentEventMetadata
): void {
  window.pendo?.trackAgent?.(eventType, { agentId: RESEARCH_ASSISTANT_AGENT_ID, ...metadata });
}
