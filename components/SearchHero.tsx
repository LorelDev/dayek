"use client";

import { useState, useRef, useEffect } from "react";

const SUGGESTIONS = [
  "יש לי רעיון לסטארטאפ של אפליקציה לתלמידים",
  "אני רוצה להקים פודקאסט אבל לא יודע על מה",
  "חשבתי על פרויקט גמר בנושא בריאות הנפש",
  "יש לי רעיון ליוזמה חברתית בקהילה שלי",
];

export default function SearchHero({
  onSubmit,
  disabled,
}: {
  onSubmit: (text: string) => void;
  disabled?: boolean;
}) {
  const [value, setValue] = useState("");
  const taRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    taRef.current?.focus();
  }, []);

  const submit = () => {
    if (!value.trim() || disabled) return;
    onSubmit(value);
    setValue("");
  };

  const onKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-white via-brand-50/40 to-white">
      <div className="mesh-bg">
        <div
          className="mesh-blob animate-blob"
          style={{
            width: 520,
            height: 520,
            background: "radial-gradient(circle, #c4b5fd 0%, transparent 70%)",
            top: "-120px",
            insetInlineStart: "-100px",
          }}
        />
        <div
          className="mesh-blob animate-blob"
          style={{
            width: 480,
            height: 480,
            background: "radial-gradient(circle, #fbcfe8 0%, transparent 70%)",
            top: "20%",
            insetInlineEnd: "-80px",
            animationDelay: "4s",
          }}
        />
        <div
          className="mesh-blob animate-blob"
          style={{
            width: 460,
            height: 460,
            background: "radial-gradient(circle, #bfdbfe 0%, transparent 70%)",
            bottom: "-100px",
            insetInlineStart: "30%",
            animationDelay: "8s",
          }}
        />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-5 py-12">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand-200/70 bg-white/70 px-3 py-1 text-xs font-medium text-brand-700 backdrop-blur animate-fade-in">
          <span className="inline-block size-1.5 rounded-full bg-brand-500 animate-pulse-soft" />
          סוכן AI לבני נוער
        </div>

        <h1 className="text-center text-5xl font-extrabold tracking-tight text-ink-900 sm:text-6xl animate-slide-up">
          בוא{" "}
          <span className="bg-gradient-to-l from-brand-600 via-pink-500 to-orange-400 bg-clip-text text-transparent">
            נדייק
          </span>{" "}
          את הרעיון שלך
        </h1>

        <p className="mt-4 max-w-xl text-center text-lg text-ink-500 animate-slide-up" style={{ animationDelay: "60ms" }}>
          תכתוב לי רעיון, מחשבה, או חזון. אני אשאל אותך שאלות חכמות, אביא לך
          מחקרים מהאינטרנט, ונחדד את זה ביחד.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
          className="mt-10 w-full animate-slide-up"
          style={{ animationDelay: "120ms" }}
        >
          <div className="group relative rounded-3xl border border-ink-200 bg-white/80 p-2 shadow-xl shadow-brand-900/5 backdrop-blur-xl transition-all focus-within:border-brand-400 focus-within:shadow-2xl focus-within:shadow-brand-500/15">
            <textarea
              ref={taRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={onKey}
              rows={3}
              placeholder="ספר לי על הרעיון שלך... מה אתה רוצה להמציא, ליצור, לשנות?"
              className="block w-full resize-none rounded-2xl bg-transparent px-4 py-3 text-lg leading-relaxed placeholder:text-ink-300 focus:outline-none"
              dir="rtl"
            />
            <div className="flex items-center justify-between px-3 pb-2 pt-1">
              <p className="text-xs text-ink-400">
                Shift+Enter לשורה חדשה · Enter לשליחה
              </p>
              <button
                type="submit"
                disabled={!value.trim() || disabled}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-l from-brand-600 to-pink-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/30 transition-all hover:scale-[1.02] hover:shadow-xl active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
              >
                שלח
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m12 19-7-7 7-7" />
                  <path d="M19 12H5" />
                </svg>
              </button>
            </div>
          </div>
        </form>

        <div
          className="mt-8 flex w-full flex-wrap items-center justify-center gap-2 animate-slide-up"
          style={{ animationDelay: "200ms" }}
        >
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                setValue(s);
                taRef.current?.focus();
              }}
              className="rounded-full border border-ink-200/70 bg-white/60 px-3.5 py-1.5 text-sm text-ink-600 backdrop-blur transition hover:border-brand-300 hover:bg-white hover:text-brand-700"
            >
              {s}
            </button>
          ))}
        </div>

        <div className="mt-16 grid w-full grid-cols-1 gap-3 sm:grid-cols-3 animate-slide-up" style={{ animationDelay: "300ms" }}>
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-ink-100 bg-white/60 p-4 backdrop-blur transition hover:border-brand-200 hover:bg-white"
            >
              <div className="mb-2 inline-flex size-9 items-center justify-center rounded-xl bg-brand-100 text-brand-700">
                {f.icon}
              </div>
              <h3 className="text-sm font-semibold text-ink-800">{f.title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-ink-500">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

const FEATURES = [
  {
    title: "שאלות חכמות",
    desc: "אני אשאל אותך שאלות שיעזרו לך לדייק את הכיוון בלי לשפוט.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <path d="M12 17h.01" />
        <circle cx="12" cy="12" r="10" />
      </svg>
    ),
  },
  {
    title: "מחקרים מהרשת",
    desc: "אני אביא לך מקורות אמיתיים, סטטיסטיקות ומאמרים מהאינטרנט.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
    ),
  },
  {
    title: "מדבר בגובה העיניים",
    desc: "בלי מילים מסובכות. רק שיחה רגילה שמכבדת אותך.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
];
