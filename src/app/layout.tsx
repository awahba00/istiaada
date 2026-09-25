import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";

const appArabic = IBM_Plex_Sans_Arabic({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["arabic", "latin"],
  variable: "--font-app",
  display: "swap",
});

export const metadata: Metadata = {
  title: "تطبيق مساعدة ذاتية سلوكية لاستعادة التحكم: لاحظ، افهم، اقطع السلسلة، تعلّم، وابنِ حياة أحسن. يعمل محليًا على جهازك — لا حسابات ولا خوادم.",
  description:
    "تطبيق مساعدة ذاتية سلوكية لاستعادة التحكم: لاحظ، افهم، اقطع السلسلة، تعلّم، وابنِ حياة أفضل. يعمل محليًا على جهازك — لا حسابات ولا خوادم.",
  applicationName: "استعادة",
  keywords: ["استعادة التحكم", "مساعدة ذاتية", "سلوك", "عادات", "خصوصية"],
  // «حلقة العودة» favicon — same mark as the in-app brand, badge form
  // (served from /public; PNG metadata-route files crash Turbopack builds).
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon-32.png", type: "image/png", sizes: "32x32" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#131e21" },
    { media: "(prefers-color-scheme: light)", color: "#f4f8f8" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body
        className={`${appArabic.variable} antialiased bg-background text-foreground min-h-screen`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          themes={["dark", "light"]}
          storageKey="istiaada-theme"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
