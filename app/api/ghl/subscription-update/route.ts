import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { verifyHighLevelSignature } from "@/lib/webhooks/ghl";
import { ensureAuthUserAndRow, parseSubUpdatePayload, upsertSubscription } from "@/lib/ghl/handlers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const raw = await req.text();
  const sig = req.headers.get("x-highlevel-signature") || req.headers.get("x-wh-signature");
  if (!verifyHighLevelSignature(raw, sig)) {
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }

  let body: any;
  try { body = JSON.parse(raw); } 
  catch { return NextResponse.json({ error: "invalid JSON" }, { status: 400 }); }

  const { email, plan, status } = parseSubUpdatePayload(body);
  if (!email || !status) return NextResponse.json({ error: "email & valid status required" }, { status: 400 });

  try {
    const userId = await ensureAuthUserAndRow(email);
    await upsertSubscription(userId, status, plan ?? null, null);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "server error" }, { status: 500 });
  }
}
