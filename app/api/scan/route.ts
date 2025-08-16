import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase/client";

export async function POST(req: NextRequest) {
  try {
    const { short, deviceHash } = await req.json();

    if (!short) {
      return NextResponse.json({ error: "short is required" }, { status: 400 });
    }

    const supabase = getSupabase();

    // 1) Zoek de tag-id
    const { data: tagRow, error: tagErr } = await supabase
      .from("tags")
      .select("id")
      .eq("short", short)
      .single();

    if (tagErr || !tagRow) {
      return NextResponse.json({ error: "tag not found" }, { status: 404 });
    }

    // 2) IP bepalen uit headers (NextRequest heeft geen req.ip)
    const fwd = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
    const real = req.headers.get("x-real-ip")?.trim();
    const ip = real ?? fwd ?? undefined;

    // 3) Log de scan (RLS policy moet inserts door anon toestaan)
    const { error: insErr } = await supabase.from("scans").insert({
      tag_id: tagRow.id,
      device_hash: deviceHash ?? "anon",
      ip_inet: ip,
    });

    if (insErr) {
      return NextResponse.json({ error: insErr.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "unknown error" }, { status: 500 });
  }
}
