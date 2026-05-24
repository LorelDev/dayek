"use client";

import { useRef, useState, useEffect } from "react";

export default function Composer({
  onSend,
  disabled,
}: {
  onSend: (text: string) => void;
  disabled?: boolean;
}) {
  const [value, setValue] = useState("");
  const taRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 200) + "px";
  }, [value]);

  const submit = () => {
    if (!value.trim() || disabled) return;
    onSend(value);
    setValue("");
    requestAnimationFrame(() => taRef.current?.focus());
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className="group relative flex items-end gap-2 rounded-2xl border border-ink-200 bg-white p-1.5 shadow-sm transition focus-within:border-brand-400 focus-within:shadow-md focus-within:shadow-brand-500/10"
    >
      <textarea
        ref={taRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            submit();
          }
        }}
        rows={1}
        placeholder="כתוב הודעה..."
        dir="rtl"
        className="block max-h-[200px] min-h-[40px] flex-1 resize-none bg-transparent px-3 py-2 text-[15px] leading-relaxed placeholder:text-ink-300 focus:outline-none"
      />
      <button
        type="submit"
        disabled={!value.trim() || disabled}
        className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-l from-brand-600 to-pink-500 text-white shadow-md shadow-brand-500/30 transition hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:scale-100"
        aria-label="שלח הודעה"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="m12 19-7-7 7-7" />
          <path d="M19 12H5" />
        </svg>
      </button>
    </form>
  );
}
