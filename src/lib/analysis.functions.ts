import { createServerFn } from "@tanstack/react-start";
import { generateText, Output } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const AnalysisSchema = z.object({
  healthScore: z
    .number()
    .min(0)
    .max(100)
    .describe("Overall financial health score from 0-100"),
  healthLabel: z
    .string()
    .describe("Short label for the score, e.g. 'Healthy', 'Needs attention', 'At risk'"),
  healthSummary: z
    .string()
    .describe("2-4 sentence plain-language summary of the organization's financial health"),
  keyInsights: z
    .array(z.string())
    .describe("3-6 important observations about the finances, in plain language"),
  actionItems: z
    .array(z.string())
    .describe("3-6 concrete, prioritized next steps the founder should take"),
  redFlags: z
    .array(z.string())
    .describe("Any concerning issues or risks. Empty array if none found"),
});

export type FinancialAnalysis = z.infer<typeof AnalysisSchema>;

const InputSchema = z.object({
  fileName: z.string().min(1).max(300),
  content: z.string().min(1).max(120000),
});

export const analyzeFinances = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => InputSchema.parse(input))
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("Missing LOVABLE_API_KEY");

    const gateway = createLovableAiGatewayProvider(apiKey);

    const { output } = await generateText({
      model: gateway("google/gemini-3-flash-preview"),
      output: Output.object({ schema: AnalysisSchema }),
      system:
        "You are Fondo, a friendly AI financial analyst for young nonprofit founders and student organization leaders. " +
        "Your audience is NOT finance experts, so explain everything in clear, encouraging, jargon-free language. " +
        "Analyze the provided financial document and produce structured insights. Be specific and reference real numbers from the data when possible. " +
        "Be honest about risks but constructive and supportive in tone.",
      prompt:
        `Here is the financial data from the file "${data.fileName}":\n\n` +
        data.content +
        "\n\nAnalyze this and produce the structured financial assessment.",
    });

    return output;
  });
