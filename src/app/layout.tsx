import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";

const appArabic = IBM_Plex_Sans_Arabic({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["arabic", "latin"],
  variable: "--font-app",
  display: "swap",
});

export const metadata: Metadata = {
  // A4 — privacy-sensitive metadata: the browser tab / history / PWA label
  // shows only the concise app name. The app's purpose is NOT part of any
  // surface a bystander can see (the visible in-app brand and copy are
  // unchanged). The old title was a full sentence describing the app's
  // recovery purpose — that sentence lived in tabs, history and task
  // switchers on shared devices.
  title: "استعادة",
  description: "أداة شخصية بتشتغل محليًا على جهازك بالكامل.",
  applicationName: "استعادة",
  // A4 — public search indexing has no product value for a device-local,
  // single-user tool; noindex + robots.txt keep it out of indexes. Honest
  // limitation (documented in the README): this reduces visibility, it does
  // NOT protect local storage from someone with access to the device or
  // browser profile.
  robots: { index: false, follow: false, nocache: true },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon-32.png", type: "image/png", sizes: "32x32" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/manifest.webmanifest",
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
        {/* Pre-hydration text-size boot: reads the device-local
            "istiaada-text-size" preference and scales the root font-size
            (percentage → keeps the browser/OS default as base) BEFORE any
            app content — including the SSR splash — paints. Mirror of
            TEXT_SIZE_LEVELS in lib/app/text-size.ts. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var m={normal:"100%",large:"125%",xlarge:"150%"};var s=m[localStorage.getItem("istiaada-text-size")];if(s)document.documentElement.style.fontSize=s}catch(e){}})();`,
          }}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          themes={["dark", "light"]}
          storageKey="istiaada-theme"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
