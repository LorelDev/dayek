"use client";

import { useState, useRef, useEffect } from "react";
import SearchHero from "@/components/SearchHero";
import ChatView from "@/components/ChatView";

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  citations?: { url: string; title?: string }[];
};

export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [streaming, setStreaming] = useState("");
  const [streamingCitations, setStreamingCitations] = useState<
    { url: string; title?: string }[]
  >([]);
  const abortRef = useRef<AbortController | null>(null);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const next: ChatMessage[] = [
      ...messages,
      { role: "user", content: trimmed },
    ];
    setMessages(next);
    setIsLoading(true);
    setStreaming("");
    setStreamingCitations([]);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        const errText = await res.text().catch(() => "");
        throw new Error(errText || `Request failed: ${res.status}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let acc = "";
      const cites: { url: string; title?: string }[] = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const payload = line.slice(6);
          if (payload === "[DONE]") continue;
          try {
            const event = JSON.parse(payload);
            if (event.type === "text") {
              acc += event.text;
              setStreaming(acc);
            } else if (event.type === "citation") {
              const exists = cites.some((c) => c.url === event.url);
              if (!exists) {
                cites.push({ url: event.url, title: event.title });
                setStreamingCitations([...cites]);
              }
            } else if (event.type === "error") {
              throw new Error(event.message || "Unknown error");
            }
          } catch {
            // ignore parse errors mid-stream
          }
        }
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: acc || "מצטער, לא הצלחתי לייצר תשובה. נסה שוב.",
          citations: cites.length ? cites : undefined,
        },
      ]);
      setStreaming("");
      setStreamingCitations([]);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "אירעה שגיאה לא ידועה";
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `אופס — משהו השתבש: ${message}. נסה שוב בעוד רגע.`,
        },
      ]);
      setStreaming("");
    } finally {
      setIsLoading(false);
      abortRef.current = null;
    }
  };

  const resetChat = () => {
    abortRef.current?.abort();
    setMessages([]);
    setStreaming("");
    setStreamingCitations([]);
    setIsLoading(false);
  };

  useEffect(() => () => abortRef.current?.abort(), []);

  if (messages.length === 0) {
    return <SearchHero onSubmit={sendMessage} disabled={isLoading} />;
  }

  return (
    <ChatView
      messages={messages}
      streaming={streaming}
      streamingCitations={streamingCitations}
      isLoading={isLoading}
      onSend={sendMessage}
      onReset={resetChat}
    />
  );
}
