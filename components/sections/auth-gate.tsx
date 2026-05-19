"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

export function useSessionGuard(redirectTo = "/auth") {
  const [session, setSession] = useState<Session | null>(null);
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setChecking(false);
      if (!data.session) router.replace(redirectTo);
    });

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_e, next) => {
      setSession(next);
      if (!next) router.replace(redirectTo);
    });

    return () => subscription.unsubscribe();
  }, [redirectTo, router]);

  return { session, checking };
}
