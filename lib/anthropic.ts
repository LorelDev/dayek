import Anthropic from "@anthropic-ai/sdk";

let client: Anthropic | null = null;

export function getAnthropic(): Anthropic {
  if (client) return client;
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error(
      "ANTHROPIC_API_KEY is missing. Add it to .env.local or Vercel env vars."
    );
  }
  client = new Anthropic({ apiKey });
  return client;
}

export const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-5";
