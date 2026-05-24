import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import "./globals.css";

const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  variable: "--font-heebo",
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "דייק — סוכן ההתייעצות שלך",
  description:
    "סוכן AI שעוזר לבני נוער לדייק רעיונות, למצוא מחקרים ולקבל הכוונה — בשפה שלך, ברמה שלך.",
  openGraph: {
    title: "דייק — סוכן ההתייעצות שלך",
    description:
      "סוכן AI שעוזר לבני נוער לדייק רעיונות ולמצוא מחקרים רלוונטיים.",
    locale: "he_IL",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl" className={heebo.variable}>
      <body className="min-h-screen font-sans antialiased text-ink-900">
        {children}
      </body>
    </html>
  );
}
