import { Button, ErrorMessage, TextAreaField } from "@fieldnotes/ui";
import { useState, type FormEvent } from "react";
import { api, type ChatMessage } from "../api/client";

export function AssistantPanel() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const send = async (event: FormEvent) => {
    event.preventDefault();
    const content = draft.trim();
    if (!content) return;
    const next: ChatMessage[] = [...messages, { role: "user", content }];
    setMessages(next);
    setDraft("");
    setSending(true);
    setError(null);
    const conversationTurnCount = next.filter((message) => message.role === "user").length;
    try {
      const { reply, model } = await api.askAssistant(next);
      setMessages([...next, { role: "assistant", content: reply }]);
      // Assistant request finished with a reply (model is null when the assistant is not configured).
      window.pendo?.track("assistant_response_received", {
        success: true,
        model: model ?? "not_configured",
        conversationTurnCount,
        promptLength: content.length,
        replyLength: reply.length,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "The assistant could not answer";
      setError(message);
      // Assistant request finished without a reply (e.g. 502 when the model is unavailable).
      window.pendo?.track("assistant_response_received", {
        success: false,
        conversationTurnCount,
        promptLength: content.length,
        errorMessage: message.substring(0, 100),
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <aside className="fn-assistant" aria-label="Research assistant">
      <div className="fn-assistant__messages">
        <h2>Research assistant</h2>
        {messages.length === 0 && (
          <p className="fn-muted">Ask about your notes, e.g. "What changed at the north pond?"</p>
        )}
        {messages.map((message, index) => (
          <p key={index} className={`fn-assistant__message fn-assistant__message--${message.role}`}>
            {message.content}
          </p>
        ))}
        <ErrorMessage message={error} />
      </div>
      <form onSubmit={(event) => void send(event)}>
        <TextAreaField
          id="assistant-prompt-input"
          label="Ask the assistant"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
        />
        <Button id="assistant-send-button" type="submit" disabled={sending || !draft.trim()}>
          {sending ? "Thinking…" : "Send"}
        </Button>
      </form>
    </aside>
  );
}
