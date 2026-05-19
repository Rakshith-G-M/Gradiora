"use client";

import { supabase } from "@/lib/supabase";

export async function signUpWithEmail(email: string, password: string) {
  return supabase.auth.signUp({ email, password });
}

export async function signInWithEmail(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signInAsGuest() {
  const email = `guest_${crypto.randomUUID().slice(0, 8)}@gradiora.local`;
  const password = `Guest#${crypto.randomUUID().slice(0, 12)}`;

  const signUp = await supabase.auth.signUp({ email, password });
  if (signUp.error && !signUp.error.message.toLowerCase().includes("already registered")) return signUp;

  return supabase.auth.signInWithPassword({ email, password });
}

export async function signOut() {
  return supabase.auth.signOut();
}
