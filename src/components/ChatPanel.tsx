import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Send, MessageCircle, Loader2 } from "lucide-react";
import logo from "@/assets/fondo-logo.png";
import { loadChatHistory, saveChatMessage } from "@/lib/chat-history";

const API_BASE = "https://fondo-production.up.railway.app";

const DEFAULT_SUGGESTIONS = [
  "How do I build a simple budget for my org?",
  "What financial red flags should I watch for?",
  "How much runway should we keep in reserve?",
];

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
}


export function ChatPanel({
  context = "",
  suggestions = DEFAULT_SUGGESTIONS,
  emptyText = "Ask Fondo anything about your finances — budgeting, runway, fundraising, or what your numbers mean.",
  className = "",
  sessionId: propSessionId,
  persistUserId,
}: {
  context?: string;
  suggestions?: string[];
  emptyText?: string;
  className?: string;
  sessionId?: string;
  persistUserId?: string;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // When a document was uploaded, use its session_id. Otherwise (homepage
  // chat with no upload) use the "general" session so the backend answers
  // as a general financial advisor without requiring uploaded data.
  const sessionId = propSessionId || "general";

  // Load persisted chat history for logged-in users.
  useEffect(() => {
    if (!persistUserId) return;
    loadChatHistory().then((history) => {
      if (history.length) setMessages(history);
    });
  }, [persistUserId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, busy, error]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const submit = async (text: string) => {
    const value = text.trim();
    if (!value || busy) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      text: value,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setBusy(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId, question: value }),
      });

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const data = await res.json();
      const answer =
        data.answer ?? data.response ?? data.message ?? JSON.stringify(data);

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        text: answer,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  };

  return (
    <section className={`rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] ${className}`}>
      <div className="flex items-center gap-2 border-b border-border px-6 py-4">
        <MessageCircle className="h-5 w-5 text-accent" />
        <h2 className="text-lg font-bold text-card-foreground">Chat with Fondo</h2>
        <span className="text-sm text-muted-foreground">your AI financial agent</span>
      </div>

      <div ref={scrollRef} className="max-h-[420px] min-h-[260px] space-y-5 overflow-y-auto px-6 py-6">
        {messages.length === 0 && (
          <div className="text-center">
            <p className="text-sm text-muted-foreground">{emptyText}</p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => submit(s)}
                  className="rounded-full border border-border bg-secondary px-3.5 py-1.5 text-xs font-medium text-secondary-foreground transition-colors hover:border-accent/60"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m) => {
          if (m.role === "user") {
            return (
              <div key={m.id} className="flex justify-end">
                <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground">
                  {m.text}
                </div>
              </div>
            );
          }
          return (
            <div key={m.id} className="flex gap-3">
              <img src={logo} alt="" width={28} height={28} className="h-7 w-7 shrink-0" />
              <div className="prose prose-sm max-w-none text-sm text-foreground prose-p:my-1.5 prose-li:my-0.5 prose-headings:text-foreground prose-strong:text-foreground">
                <ReactMarkdown>{m.text || "…"}</ReactMarkdown>
              </div>
            </div>
          );
        })}

        {busy && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Thinking…
          </div>
        )}

        {error && (
          <p className="text-sm text-destructive">
            {error}
          </p>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit(input);
        }}
        className="flex items-end gap-2 border-t border-border p-4"
      >
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit(input);
            }
          }}
          rows={1}
          placeholder="Ask a follow-up question…"
          className="max-h-32 flex-1 resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-accent"
        />
        <button
          type="submit"
          disabled={busy || !input.trim()}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-40"
          aria-label="Send message"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </section>
  );
}
