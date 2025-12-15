import type { Metadata, Viewport } from "next";
import "./globals.css"

// 禁止手機縮放，設定狀態列顏色
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#111827",
};

export const metadata: Metadata = {
  title: "MD Vinyl Web",
  description: "Web-based Vinyl Player",
  appleWebApp: {
    capable: true, // 允許加入主畫面後全螢幕
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
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}