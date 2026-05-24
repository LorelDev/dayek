# דייק — סוכן ההתייעצות לבני נוער

סוכן AI שעוזר לבני נוער לדייק רעיונות, למצוא מחקרים מהרשת, ולקבל ייעוץ בגובה העיניים.

בנוי על Next.js 15, React 19, Tailwind CSS, ו-Claude API עם web search מובנה.

## הרצה מקומית

```bash
# 1. התקנה
npm install

# 2. קונפיגורציה
cp .env.example .env.local
# הוסף את ה-ANTHROPIC_API_KEY שלך מ-https://console.anthropic.com/

# 3. הפעלה
npm run dev
```

פתח http://localhost:3000

## דיפלוי ל-Vercel

1. דחוף את הריפו ל-GitHub
2. ב-[vercel.com/new](https://vercel.com/new), חבר את הריפו
3. הוסף את משתנה הסביבה `ANTHROPIC_API_KEY` בהגדרות הפרויקט
4. Deploy

או דרך CLI:

```bash
npm i -g vercel
vercel
vercel env add ANTHROPIC_API_KEY
vercel --prod
```

## משתני סביבה

| שם | תיאור | חובה |
|----|------|------|
| `ANTHROPIC_API_KEY` | מפתח Claude API | כן |
| `ANTHROPIC_MODEL` | מודל (ברירת מחדל: `claude-sonnet-4-5`) | לא |

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
  anthropic.ts         # client + הגדרת המודל
  system-prompt.ts     # האישיות והסקילים של דייק
```

## התאמה אישית

- **שינוי האישיות**: ערוך את `lib/system-prompt.ts`
- **שינוי המודל**: הגדר `ANTHROPIC_MODEL` ב-env (למשל `claude-opus-4-5`)
- **שינוי עיצוב**: הצבעים ב-`tailwind.config.ts` תחת `colors.brand`
- **שינוי הצעות במסך הבית**: עדכן את `SUGGESTIONS` ב-`components/SearchHero.tsx`
