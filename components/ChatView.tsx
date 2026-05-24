"use client";

import { useEffect, useRef } from "react";
import type { ChatMessage } from "@/app/page";
import MessageBubble from "@/components/MessageBubble";
import Composer from "@/components/Composer";

export default function ChatView({
  messages,
  streaming,
  streamingCitations,
  isLoading,
  onSend,
  onReset,
}: {
  messages: ChatMessage[];
  streaming: string;
  streamingCitations: { url: string; title?: string }[];
  isLoading: boolean;
  onSend: (text: string) => void;
  onReset: () => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, streaming]);

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-b from-white to-brand-50/30">
      <header className="sticky top-0 z-10 border-b border-ink-100 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-pink-500 text-white shadow-lg shadow-brand-500/30">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="m2 17 10 5 10-5" />
                <path d="m2 12 10 5 10-5" />
              </svg>
            </div>
            <div>
              <h1 className="text-sm font-bold leading-none text-ink-900">דייק</h1>
              <p className="mt-0.5 text-[11px] text-ink-400">סוכן ההתייעצות שלך</p>
            </div>
          </div>
          <button
            onClick={onReset}
            className="rounded-full border border-ink-200 bg-white px-3 py-1.5 text-xs font-medium text-ink-600 transition hover:border-brand-300 hover:text-brand-700"
          >
            שיחה חדשה
          </button>
        </div>
      </header>

      <div
        ref={scrollRef}
        className="mx-auto w-full max-w-3xl flex-1 overflow-y-auto px-4 py-6"
      >
        <div className="flex flex-col gap-5">
          {messages.map((m, i) => (
            <MessageBubble key={i} message={m} />
          ))}

          {isLoading && streaming && (
            <MessageBubble
              message={{
                role: "assistant",
                content: streaming,
                citations: streamingCitations.length
                  ? streamingCitations
                  : undefined,
              }}
              isStreaming
            />
          )}

          {isLoading && !streaming && (
            <div className="flex animate-fade-in items-center gap-2 self-start rounded-2xl bg-white px-4 py-3 shadow-sm">
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
            </div>
          )}
        </div>
      </div>

      <div className="sticky bottom-0 border-t border-ink-100 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto w-full max-w-3xl px-4 py-3">
          <Composer onSend={onSend} disabled={isLoading} />
        </div>
      </div>
    </main>
  );
}
