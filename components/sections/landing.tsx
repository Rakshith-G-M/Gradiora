"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Brain, Sparkles, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Landing() {
  return <main className="px-6 pb-16"><nav className="mx-auto flex max-w-6xl items-center justify-between py-6"><div className="text-xl font-bold">Gradiora AI</div><Button variant="ghost">Sign In</Button></nav>
    <section className="mx-auto grid max-w-6xl gap-8 py-16 md:grid-cols-2">
      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}><p className="mb-4 text-secondary">AI Interview Copilot</p><h1 className="text-5xl font-bold leading-tight">Ace Interviews with <span className="bg-gradient-to-r from-purple-400 to-cyan-300 bg-clip-text text-transparent">Local AI</span></h1><p className="mt-6 text-white/70">Practice, adapt, and get instant NLP-powered feedback—completely in-browser.</p><div className="mt-8 flex gap-3"><Link href="/dashboard"><Button size="lg" className="animate-glow">Start Mock Interview</Button></Link><Link href="/interview"><Button size="lg" variant="ghost">Live Demo</Button></Link></div></motion.div>
      <Card className="animate-float p-8"><div className="shimmer h-52 rounded-xl" /></Card>
    </section>
    <section className="mx-auto grid max-w-6xl gap-4 md:grid-cols-3">{[[Brain,'Adaptive questioning'],[TrendingUp,'Performance analytics'],[Sparkles,'Transformer NLP scoring']].map(([I,t],i)=><motion.div key={i} whileHover={{y:-4}}><Card><I className="mb-3 text-secondary"/><p>{t as string}</p></Card></motion.div>)}</section>
  </main>;
}
