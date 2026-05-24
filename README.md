# דייק — סוכן ההתייעצות לבני נוער

סוכן AI שעוזר לבני נוער לדייק רעיונות, למצוא מחקרים מהרשת, ולקבל ייעוץ בגובה העיניים.

בנוי על Next.js 15, React 19, Tailwind CSS, ו-DeepSeek API (זול ואיכותי). Web search אופציונלי דרך Tavily.

## הרצה מקומית

```bash
# 1. התקנה
npm install

# 2. קונפיגורציה
cp .env.example .env.local
# הוסף את ה-DEEPSEEK_API_KEY שלך מ-https://platform.deepseek.com/
# (אופציונלי) הוסף TAVILY_API_KEY ל-web search חינמי מ-https://tavily.com/

# 3. הפעלה
npm run dev
```

פתח http://localhost:3000

## דיפלוי ל-Vercel

1. דחוף את הריפו ל-GitHub
2. ב-[vercel.com/new](https://vercel.com/new), חבר את הריפו
3. הוסף את משתנה הסביבה `DEEPSEEK_API_KEY` בהגדרות הפרויקט (ואופציונלית `TAVILY_API_KEY`)
4. Deploy

או דרך CLI:

```bash
npm i -g vercel
vercel
vercel env add DEEPSEEK_API_KEY
vercel --prod
```

## משתני סביבה

| שם | תיאור | חובה |
|----|------|------|
| `DEEPSEEK_API_KEY` | מפתח DeepSeek API | כן |
| `DEEPSEEK_MODEL` | `deepseek-chat` (V3, מהיר) או `deepseek-reasoner` (R1, חושב לעומק) | לא |
| `TAVILY_API_KEY` | מפתח Tavily להפעלת web search (free 1000/חודש) | לא |

## מבנה הפרויקט

```
app/
  api/chat/route.ts    # SSE streaming endpoint ל-Claude + web search
  layout.tsx           # RTL, פונט עברי (Heebo)
  page.tsx             # State management של השיחה
  globals.css
components/
  SearchHero.tsx       # מסך הבית עם שורת חיפוש
  ChatView.tsx         # מסך השיחה
  MessageBubble.tsx    # הודעה בודדת (Markdown + ציטוטים)
  Composer.tsx         # שורת הקלט בתחתית
lib/
  llm.ts               # DeepSeek client (OpenAI-compatible)
  web-search.ts        # אינטגרציה אופציונלית עם Tavily
  system-prompt.ts     # האישיות והסקילים של דייק
```

## התאמה אישית

- **שינוי האישיות**: ערוך את `lib/system-prompt.ts`
- **שינוי המודל**: הגדר `DEEPSEEK_MODEL=deepseek-reasoner` ל-R1 (חושב יותר לעומק)
- **שינוי עיצוב**: הצבעים ב-`tailwind.config.ts` תחת `colors.brand`
- **שינוי הצעות במסך הבית**: עדכן את `SUGGESTIONS` ב-`components/SearchHero.tsx`
