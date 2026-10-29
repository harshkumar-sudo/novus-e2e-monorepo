/** Pendo trackAgent events for the Fieldnotes Research Assistant (apps/api assistant route). */

export const RESEARCH_ASSISTANT_AGENT_ID = "uBkgSOiHn3ZBg8ueu-jFZ2_IFPY";

export type AgentEventType = "prompt" | "agent_response" | "user_reaction";

export interface AgentEventMetadata {
  agentId: string;
  conversationId: string;
  messageId: string;
  content: string;
  modelUsed?: string;
  suggestedPrompt?: boolean;
  toolsUsed?: string[];
  fileUploaded?: boolean;
}

export function trackAssistantEvent(
  eventType: AgentEventType,
  metadata: Omit<AgentEventMetadata, "agentId">
): void {
  window.pendo?.trackAgent?.(eventType, { agentId: RESEARCH_ASSISTANT_AGENT_ID, ...metadata });
}
