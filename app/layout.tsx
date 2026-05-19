import type { Metadata } from "next";
import "./globals.css";
<<<<<<< HEAD
=======
import { TopNav } from "@/components/sections/top-nav";
import { PageTransition } from "@/components/sections/page-transition";
>>>>>>> origin/codex/build-ai-interview-preparation-saas-app-xyd5m4

export const metadata: Metadata = {
  title: "Gradiora AI",
  description: "AI-powered interview preparation platform"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
<<<<<<< HEAD
      <body>{children}</body>
=======
      <body>
        <TopNav />
        <PageTransition>{children}</PageTransition>
      </body>
>>>>>>> origin/codex/build-ai-interview-preparation-saas-app-xyd5m4
    </html>
  );
}
