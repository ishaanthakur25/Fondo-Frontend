import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";

type ChatRequestBody = {
  messages?: unknown;
  context?: unknown;
};

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json()) as ChatRequestBody;
        const { messages, context } = body;

        if (!Array.isArray(messages)) {
          return new Response("Messages are required", { status: 400 });
        }

        const apiKey = process.env.LOVABLE_API_KEY;
        if (!apiKey) {
          return new Response("Missing LOVABLE_API_KEY", { status: 500 });
        }

        const contextText =
          typeof context === "string" ? context.slice(0, 60000) : "";

        const gateway = createLovableAiGatewayProvider(apiKey);

        const result = streamText({
          model: gateway("google/gemini-3-flash-preview"),
          system:
            "You are Fondo, an AI CFO and personal financial agent for young founders, nonprofit leaders, and student organization leaders. " +
            "You are a warm, sharp, proactive agent — not a generic chatbot. Speak in plain English, avoid jargon, and give specific, actionable guidance. " +
            "Help with budgeting, runway, fundraising, spending, and financial decisions. Be encouraging but honest about risks. " +
            "Keep answers concise and practical. " +
            (contextText
              ? "Use the user's financial context below to ground your answers. If something isn't in the data, say so honestly.\n\n=== FINANCIAL CONTEXT ===\n" +
                contextText
              : "The user has not uploaded a financial document yet. Answer their questions directly, and when helpful, gently note that uploading a document unlocks a deeper, personalized analysis."),
          messages: await convertToModelMessages(messages as UIMessage[]),
        });

        return result.toUIMessageStreamResponse({
          originalMessages: messages as UIMessage[],
        });
      },
    },
  },
});
