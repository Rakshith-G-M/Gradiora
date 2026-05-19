"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Session } from "@supabase/supabase-js";
import { fallbackAuth } from "@/lib/fallback";
import { supabase } from "@/lib/supabase";

type GuardSession = Session | { user: { id: string; email?: string | null } } | null;

export function useSessionGuard(redirectTo = "/auth") {
  const [session, setSession] = useState<GuardSession>(null);
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let sub: { unsubscribe: () => void } | null = null;

    const boot = async () => {
      const localUser = fallbackAuth.getUser();
      if (localUser) {
        setSession({ user: { id: localUser.id, email: localUser.email } });
        setChecking(false);
        return;
      }

      if (!supabase) {
        setChecking(false);
        router.replace(redirectTo);
        return;
      }

      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setChecking(false);
      if (!data.session) router.replace(redirectTo);

      const { data: listener } = supabase.auth.onAuthStateChange((_e, next) => {
        setSession(next);
        if (!next && !fallbackAuth.getUser()) router.replace(redirectTo);
      });
      sub = listener.subscription;
    };

    boot();
    return () => sub?.unsubscribe();
  }, [redirectTo, router]);

  return { session, checking };
}
