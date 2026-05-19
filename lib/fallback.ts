"use client";

export type DemoUser = { id: string; email: string; isGuest?: boolean };

const K = {
  user: "gradiora_demo_user",
  reports: "gradiora_demo_reports",
  sessions: "gradiora_demo_sessions",
  answers: "gradiora_demo_answers"
} as const;

export const fallbackAuth = {
  getUser(): DemoUser | null {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(K.user);
    return raw ? (JSON.parse(raw) as DemoUser) : null;
  },
  setUser(user: DemoUser) {
    localStorage.setItem(K.user, JSON.stringify(user));
  },
  clear() {
    localStorage.removeItem(K.user);
  }
};

export function pushLocal<T>(key: string, value: T) {
  const raw = localStorage.getItem(key);
  const arr = raw ? JSON.parse(raw) : [];
  arr.push(value);
  localStorage.setItem(key, JSON.stringify(arr));
}

export function getLocal<T>(key: string): T[] {
  const raw = localStorage.getItem(key);
  return raw ? (JSON.parse(raw) as T[]) : [];
}

export const fallbackKeys = K;
