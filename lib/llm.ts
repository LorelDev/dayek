import OpenAI from "openai";

let client: OpenAI | null = null;

export function getLLM(): OpenAI {
  if (client) return client;
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    throw new Error(
      "DEEPSEEK_API_KEY is missing. Add it to .env.local or Vercel env vars."
    );
  }
  client = new OpenAI({
    apiKey,
    baseURL: "https://api.deepseek.com",
  });
  return client;
}

export const MODEL = process.env.DEEPSEEK_MODEL || "deepseek-chat";

export const WEB_SEARCH_ENABLED = !!process.env.TAVILY_API_KEY;
