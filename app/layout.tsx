import type { Metadata } from "next";
import "./globals.css";
import { TopNav } from "@/components/sections/top-nav";
import { PageTransition } from "@/components/sections/page-transition";

export const metadata: Metadata = {
  title: "Gradiora AI",
  description: "AI-powered interview preparation platform"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>
        <TopNav />
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  );
}
