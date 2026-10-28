/** Browser AI agent events for the Fieldnotes research assistant (Pendo trackAgent). */

const RESEARCH_ASSISTANT_AGENT_ID = "py7p-K2VMf_nHPqp-j79X525aYk";

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
