"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { ChatMessage } from "@/app/page";

export default function MessageBubble({
  message,
  isStreaming,
}: {
  message: ChatMessage;
  isStreaming?: boolean;
}) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex animate-slide-up gap-3 ${
        isUser ? "flex-row-reverse" : "flex-row"
      }`}
    >
      <div
        className={`flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
          isUser
            ? "bg-ink-900 text-white"
            : "bg-gradient-to-br from-brand-500 to-pink-500 text-white shadow-md shadow-brand-500/30"
        }`}
      >
        {isUser ? "את/ה" : "ד"}
      </div>

      <div
        className={`flex max-w-[85%] flex-col ${
          isUser ? "items-end" : "items-start"
        }`}
      >
        <div
          className={`rounded-2xl px-4 py-3 text-[15px] leading-relaxed ${
            isUser
              ? "rounded-tr-sm bg-ink-900 text-white"
              : "rounded-tl-sm border border-ink-100 bg-white text-ink-800 shadow-sm"
          }`}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <div className="md-content">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.content}
              </ReactMarkdown>
              {isStreaming && (
                <span className="ms-1 inline-block h-4 w-1 animate-pulse bg-brand-500 align-text-bottom" />
              )}
            </div>
          )}
        </div>

        {!isUser && message.citations && message.citations.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {message.citations.map((c, i) => {
              let host = "";
              try {
                host = new URL(c.url).hostname.replace(/^www\./, "");
              } catch {
                host = c.url;
              }
              return (
                <a
                  key={i}
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={c.title || c.url}
                  className="group inline-flex max-w-xs items-center gap-1.5 rounded-full border border-ink-200 bg-white px-2.5 py-1 text-[11px] text-ink-600 transition hover:border-brand-300 hover:text-brand-700"
                >
                  <span className="inline-flex size-3.5 shrink-0 items-center justify-center rounded-full bg-brand-100 text-[9px] font-bold text-brand-700">
                    {i + 1}
                  </span>
                  <span className="truncate">{c.title || host}</span>
                </a>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
