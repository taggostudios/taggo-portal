import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { verifyHighLevelSignature } from "@/lib/webhooks/ghl";
import { ensureAuthUserAndRow, linkOrCreateTag, parsePaymentPayload, upsertSubscription } from "@/lib/ghl/handlers";

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

  const { email, tagShort, plan, periodEnd } = parsePaymentPayload(body);
  if (!email) return NextResponse.json({ error: "email required" }, { status: 400 });

  try {
    const userId = await ensureAuthUserAndRow(email);
    await upsertSubscription(userId, "active", plan ?? null, periodEnd ?? null);
    if (tagShort) await linkOrCreateTag(userId, String(tagShort));
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "server error" }, { status: 500 });
  }
}
