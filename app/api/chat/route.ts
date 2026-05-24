import { NextRequest } from "next/server";
import { getAnthropic, MODEL } from "@/lib/anthropic";
import { SYSTEM_PROMPT } from "@/lib/system-prompt";

export const runtime = "nodejs";
export const maxDuration = 60;

type ClientMessage = {
  role: "user" | "assistant";
  content: string;
};

export async function POST(req: NextRequest) {
  let body: { messages?: ClientMessage[] };
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const messages = body.messages;
  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response("messages required", { status: 400 });
  }

  const apiMessages = messages
    .filter((m) => m && (m.role === "user" || m.role === "assistant"))
    .map((m) => ({ role: m.role, content: m.content }));

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (obj: unknown) => {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(obj)}\n\n`)
        );
      };

      try {
        const anthropic = getAnthropic();

        const response = anthropic.messages.stream({
          model: MODEL,
          max_tokens: 2048,
          system: SYSTEM_PROMPT,
          messages: apiMessages,
          tools: [
            {
              type: "web_search_20250305",
              name: "web_search",
              max_uses: 5,
            },
          ],
        });

        for await (const event of response) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            send({ type: "text", text: event.delta.text });
          } else if (
            event.type === "content_block_delta" &&
            event.delta.type === "citations_delta"
          ) {
            const citation = event.delta.citation;
            if (citation && "url" in citation && citation.url) {
              send({
                type: "citation",
                url: citation.url,
                title:
                  "title" in citation
                    ? (citation.title as string | undefined)
                    : undefined,
              });
            }
          } else if (event.type === "message_stop") {
            send({ type: "done" });
          }
        }

        controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
        controller.close();
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Unknown server error";
        console.error("Chat API error:", err);
        send({ type: "error", message });
        controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
