import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#000000",
};

export const metadata: Metadata = {
  title: "MD Vinyl Web",
  description: "Web-based Vinyl Player with Groq AI",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "MD Vinyl",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // ⚠️ 關鍵：加上 suppressHydrationWarning
    // 這能解決因為 Theme 切換導致的 class/style 不匹配錯誤
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">{children}</body>
    </html>
  );
}