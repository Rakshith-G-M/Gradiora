"use client";

import { fallbackAuth } from "@/lib/fallback";
import { supabase } from "@/lib/supabase";

const demoUser = (email: string, isGuest = false) => ({ id: `demo-${crypto.randomUUID()}`, email, isGuest });

export async function signUpWithEmail(email: string, password: string) {
  if (!supabase) {
    fallbackAuth.setUser(demoUser(email));
    return { data: { user: fallbackAuth.getUser() }, error: null } as any;
  }
  const res = await supabase.auth.signUp({ email, password });
  if (res.error) return res;
  const sessionRes = await supabase.auth.signInWithPassword({ email, password });
  if (sessionRes.error) return sessionRes as any;
  return sessionRes as any;
}

export async function signInWithEmail(email: string, password: string) {
  if (!supabase) {
    fallbackAuth.setUser(demoUser(email));
    return { data: { user: fallbackAuth.getUser() }, error: null } as any;
  }
  return supabase.auth.signInWithPassword({ email, password }) as any;
}

export async function signInAsGuest() {
  if (!supabase) {
    fallbackAuth.setUser(demoUser("guest@local.demo", true));
    return { data: { user: fallbackAuth.getUser() }, error: null } as any;
  }
  const email = `guest_${Date.now()}_${Math.floor(Math.random() * 1000)}@gradiora.local`;
  const password = `Guest#${crypto.randomUUID().slice(0, 10)}`;
  const signUp = await supabase.auth.signUp({ email, password });
  if (signUp.error) return signUp as any;
  return supabase.auth.signInWithPassword({ email, password }) as any;
}

export async function signOut() {
  fallbackAuth.clear();
  if (!supabase) return { error: null } as any;
  return supabase.auth.signOut() as any;
}
