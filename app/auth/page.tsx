"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { signInAsGuest, signInWithEmail, signUpWithEmail } from "@/lib/auth";

export default function AuthPage() {
  const params = useSearchParams();
  const requestedMode = params.get("mode");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (requestedMode === "signup" || requestedMode === "signin") {
      setMode(requestedMode);
    }
  }, [requestedMode]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const result = mode === "signin" ? await signInWithEmail(email, password) : await signUpWithEmail(email, password);
    setLoading(false);
    if (result.error) return setError(result.error.message);
    router.push(params.get("next") || "/dashboard");
  };

  const guest = async () => {
    setLoading(true);
    setError(null);
    const result = await signInAsGuest();
    setLoading(false);
    if (result.error) return setError(result.error.message);
    router.push(params.get("next") || "/dashboard");
  };

  return (
    <main className="mx-auto flex min-h-[80vh] max-w-6xl items-center px-6 py-10">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full">
        <Card className="mx-auto w-full max-w-md p-8">
          <h1 className="text-3xl font-bold">Welcome to Gradiora AI</h1>
          <p className="mt-2 text-sm text-white/70">Secure sign in for your interview workspace.</p>

          <form onSubmit={submit} className="mt-6 space-y-3">
            <input className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
            <input className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3" type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
            {error ? <p className="text-sm text-red-300">{error}</p> : null}
            <Button className="w-full" disabled={loading}>{loading ? "Authenticating..." : mode === "signin" ? "Sign In" : "Create Account"}</Button>
          </form>

          <Button onClick={guest} variant="ghost" className="mt-3 w-full" disabled={loading}>Continue as Guest</Button>
          <button type="button" className="mt-4 w-full text-sm text-white/70 hover:text-white" onClick={() => setMode(mode === "signin" ? "signup" : "signin")}>
            {mode === "signin" ? "Need an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </Card>
      </motion.div>
    </main>
  );
}
