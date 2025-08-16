// lib/webhooks/ghl.ts
import crypto from "crypto";

export function verifyHighLevelSignature(rawBody: string, headerSig: string | null) {
  const secret = process.env.GHL_WEBHOOK_SECRET;
  if (!secret || !headerSig) return true; // toestaan in dev als geen secret
  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  // constant-time compare
  const a = Buffer.from(headerSig);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

// simpele getter: pad "a.b.c" uit object halen
export function getByPath(obj: any, path: string): any {
  return path.split(".").reduce((o, k) => (o && k in o ? o[k] : undefined), obj);
}

// haal 1e non-undefined uit mogelijke paden
export function pickFirst(obj: any, paths: string[]): any {
  for (const p of paths) {
    const v = getByPath(obj, p);
    if (v !== undefined && v !== null && v !== "") return v;
  }
  return undefined;
}
