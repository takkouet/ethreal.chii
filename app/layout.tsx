import type { Metadata } from "next";
import { M_PLUS_Rounded_1c } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/cart-context";
import { ToastProvider } from "@/components/toast";
import { siteUrl } from "@/lib/site";
import { AnnouncementBar } from "@/components/announcement-bar";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

// M PLUS Rounded 1c — the exact font chiikawamarket.jp uses (rounded kawaii),
// for headings, body, nav and buttons. Sourced from Google Fonts.
const mplus = M_PLUS_Rounded_1c({
  variable: "--font-mplus",
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: "Chiikawa Market — ちいかわマーケット",
    template: "%s — Chiikawa Market",
  },
  description: "Buy Chiikawa goods. Delivered across Vietnam.",
  icons: { icon: "/favicon.png" },
  openGraph: {
    type: "website",
    siteName: "Chiikawa Market",
    title: "Chiikawa Market — ちいかわマーケット",
    description: "Buy Chiikawa goods. Delivered across Vietnam.",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${mplus.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ToastProvider>
          <CartProvider>
            <AnnouncementBar />
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </CartProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
