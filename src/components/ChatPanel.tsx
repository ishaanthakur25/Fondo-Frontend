import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Send, MessageCircle, Loader2 } from "lucide-react";
import logo from "@/assets/fondo-logo.png";

const DEFAULT_SUGGESTIONS = [
  "How do I build a simple budget for my org?",
  "What financial red flags should I watch for?",
  "How much runway should we keep in reserve?",
];

export function ChatPanel({
  context = "",
  suggestions = DEFAULT_SUGGESTIONS,
  emptyText = "Ask Fondo anything about your finances — budgeting, runway, fundraising, or what your numbers mean.",
  className = "",
}: {
  context?: string;
  suggestions?: string[];
  emptyText?: string;
  className?: string;
}) {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const transport = useMemo(
    () => new DefaultChatTransport({ api: "/api/chat", body: { context } }),
    [context],
  );

  const { messages, sendMessage, status, error } = useChat({ transport });

  const busy = status === "submitted" || status === "streaming";

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const submit = (text: string) => {
    const value = text.trim();
    if (!value || busy) return;
    sendMessage({ text: value });
    setInput("");
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  return (
    <section className="rounded-2xl border border-border bg-card shadow-[var(--shadow-card)]">
      <div className="flex items-center gap-2 border-b border-border px-6 py-4">
        <MessageCircle className="h-5 w-5 text-accent" />
        <h2 className="text-lg font-bold text-card-foreground">Ask Fondo</h2>
        <span className="text-sm text-muted-foreground">about your finances</span>
      </div>

      <div ref={scrollRef} className="max-h-[420px] space-y-5 overflow-y-auto px-6 py-6">
        {messages.length === 0 && (
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Ask anything about your report — Fondo has the full context.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {SUGGESTIONS.map((s) => (
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
          const text = m.parts
            .map((p) => (p.type === "text" ? p.text : ""))
            .join("");
          if (m.role === "user") {
            return (
              <div key={m.id} className="flex justify-end">
                <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground">
                  {text}
                </div>
              </div>
            );
          }
          return (
            <div key={m.id} className="flex gap-3">
              <img src={logo} alt="" width={28} height={28} className="h-7 w-7 shrink-0" />
              <div className="prose prose-sm max-w-none text-sm text-foreground prose-p:my-1.5 prose-li:my-0.5 prose-headings:text-foreground prose-strong:text-foreground">
                <ReactMarkdown>{text || "…"}</ReactMarkdown>
              </div>
            </div>
          );
        })}

        {status === "submitted" && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Thinking…
          </div>
        )}

        {error && (
          <p className="text-sm text-destructive">
            Something went wrong. Please try again.
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
