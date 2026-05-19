import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gradiora AI",
  description: "AI-powered interview preparation platform"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}
