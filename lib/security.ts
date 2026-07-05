const MAX_STRING_LENGTH = 10000;
const MAX_ARRAY_LENGTH = 100;

export function sanitizeString(input: string): string {
  if (typeof input !== "string") return "";
  return input
    .slice(0, MAX_STRING_LENGTH)
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/on\w+\s*=\s*"[^"]*"/gi, "")
    .replace(/on\w+\s*=\s*'[^']*'/gi, "")
    .replace(/javascript\s*:/gi, "")
    .trim();
}

export function sanitizeObject<T>(obj: T): T {
  if (typeof obj === "string") return sanitizeString(obj) as T;
  if (Array.isArray(obj)) {
    return obj.slice(0, MAX_ARRAY_LENGTH).map(sanitizeObject) as T;
  }
  if (obj && typeof obj === "object") {
    const cleaned: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      cleaned[key] = sanitizeObject(value);
    }
    return cleaned as T;
  }
  return obj;
}

export function validateEmail(email: string): boolean {
  if (typeof email !== "string") return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePassword(password: string): boolean {
  if (typeof password !== "string") return false;
  return password.length >= 6 && password.length <= 128;
}

export function validateRole(role: string): boolean {
  const validRoles = ["frontend", "backend", "python", "aiml", "hr", "fullstack", "devops", "mobile"];
  return validRoles.includes(role);
}

export function validateId(id: string): boolean {
  if (typeof id !== "string") return false;
  return /^[a-zA-Z0-9_-]+$/.test(id) && id.length <= 64;
}

export function createSafeResponse(data: unknown, status = 200) {
  const headers: Record<string, string> = {
    "X-RateLimit-Limit": "10",
    "Cache-Control": "no-store",
  };

  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...headers },
  });
}
