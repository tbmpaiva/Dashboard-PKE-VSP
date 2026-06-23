import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PKE FAP | Dashboard VSP",
  description: "Dashboard de performance das Video Sales Pages FAP — PKE Automotive",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/logo-pke.png", sizes: "any" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt">
      <body>{children}</body>
    </html>
  );
}
