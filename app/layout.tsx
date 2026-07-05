import type { Metadata } from "next";
import "./globals.css";
import { TopNav } from "@/components/sections/top-nav";
import { PageTransition } from "@/components/sections/page-transition";

export const metadata: Metadata = {
  title: "Gradiora AI — From 0 to Interview Ready",
  description: "Multi-agent AI interview preparation platform. Five specialized agents assess, roadmap, question, evaluate, and report your interview readiness."
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
