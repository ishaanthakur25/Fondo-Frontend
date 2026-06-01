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
            "You are Fondo, a friendly AI financial agent for young nonprofit founders and student organization leaders. " +
            "Answer follow-up questions about the user's finances clearly and without jargon. Be supportive and concrete. " +
            "Use the financial context below to ground your answers. If something isn't in the data, say so honestly.\n\n" +
            "=== FINANCIAL CONTEXT ===\n" +
            contextText,
          messages: await convertToModelMessages(messages as UIMessage[]),
        });

        return result.toUIMessageStreamResponse({
          originalMessages: messages as UIMessage[],
        });
      },
    },
  },
});
