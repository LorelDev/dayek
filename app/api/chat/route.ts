import { NextRequest } from "next/server";
import type {
  ChatCompletionMessageParam,
  ChatCompletionTool,
} from "openai/resources/chat/completions";
import { getLLM, MODEL, WEB_SEARCH_ENABLED } from "@/lib/llm";
import { SYSTEM_PROMPT } from "@/lib/system-prompt";
import { tavilySearch } from "@/lib/web-search";

export const runtime = "nodejs";
export const maxDuration = 60;

type ClientMessage = {
  role: "user" | "assistant";
  content: string;
};

const tools: ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "web_search",
      description:
        "חיפוש מידע עדכני באינטרנט. השתמש בזה כשצריך מחקרים, סטטיסטיקות, דוגמאות אמיתיות, או מידע שעלול להשתנות לאחר אימון המודל.",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "שאילתת החיפוש. כתוב באנגלית או עברית, לפי מה שייתן תוצאות טובות יותר.",
          },
        },
        required: ["query"],
      },
    },
  },
];

export async function POST(req: NextRequest) {
  let body: { messages?: ClientMessage[] };
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const incoming = body.messages;
  if (!Array.isArray(incoming) || incoming.length === 0) {
    return new Response("messages required", { status: 400 });
  }

  const conversation: ChatCompletionMessageParam[] = [
    { role: "system", content: SYSTEM_PROMPT },
    ...incoming
      .filter((m) => m && (m.role === "user" || m.role === "assistant"))
      .map(
        (m) =>
          ({ role: m.role, content: m.content }) as ChatCompletionMessageParam
      ),
  ];

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (obj: unknown) => {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(obj)}\n\n`)
        );
      };

      const sentCitations = new Set<string>();
      const llm = getLLM();

      try {
        // Multi-turn loop: model may call web_search, we execute, model continues.
        for (let turn = 0; turn < 4; turn++) {
          const completion = await llm.chat.completions.create({
            model: MODEL,
            messages: conversation,
            stream: true,
            tools: WEB_SEARCH_ENABLED ? tools : undefined,
            temperature: 0.7,
            max_tokens: 2048,
          });

          let assistantText = "";
          const toolCallsAcc: Record<
            number,
            { id: string; name: string; args: string }
          > = {};

          for await (const chunk of completion) {
            const choice = chunk.choices?.[0];
            if (!choice) continue;
            const delta = choice.delta;

            if (delta?.content) {
              assistantText += delta.content;
              send({ type: "text", text: delta.content });
            }

            if (delta?.tool_calls) {
              for (const tc of delta.tool_calls) {
                const idx = tc.index;
                if (!toolCallsAcc[idx]) {
                  toolCallsAcc[idx] = { id: "", name: "", args: "" };
                }
                if (tc.id) toolCallsAcc[idx].id = tc.id;
                if (tc.function?.name)
                  toolCallsAcc[idx].name += tc.function.name;
                if (tc.function?.arguments)
                  toolCallsAcc[idx].args += tc.function.arguments;
              }
            }
          }

          const toolCalls = Object.values(toolCallsAcc).filter((t) => t.id);

          if (toolCalls.length === 0) {
            // No more tool calls — we're done.
            break;
          }

          // Push assistant turn with tool calls
          conversation.push({
            role: "assistant",
            content: assistantText || null,
            tool_calls: toolCalls.map((t) => ({
              id: t.id,
              type: "function",
              function: { name: t.name, arguments: t.args || "{}" },
            })),
          });

          // Execute each tool call
          for (const tc of toolCalls) {
            if (tc.name === "web_search") {
              let query = "";
              try {
                query = JSON.parse(tc.args || "{}").query || "";
              } catch {
                query = "";
              }

              const results = query ? await tavilySearch(query, 5) : [];

              for (const r of results) {
                if (!sentCitations.has(r.url)) {
                  sentCitations.add(r.url);
                  send({ type: "citation", url: r.url, title: r.title });
                }
              }

              const summary = results.length
                ? results
                    .map(
                      (r, i) =>
                        `[${i + 1}] ${r.title}\n${r.url}\n${r.content.slice(0, 600)}`
                    )
                    .join("\n\n")
                : "לא נמצאו תוצאות.";

              conversation.push({
                role: "tool",
                tool_call_id: tc.id,
                content: summary,
              });
            } else {
              conversation.push({
                role: "tool",
                tool_call_id: tc.id,
                content: `Unknown tool: ${tc.name}`,
              });
            }
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
