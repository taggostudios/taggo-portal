console.log("ScanLogger import:", ScanLogger);
import ScanLogger from "./ScanLogger";
import { getSupabase } from "@/lib/supabase/client";

export default async function TagResolverPage({
  params,
}: {
  params: Promise<{ short: string }>;
}) {
  const { short } = await params; // 👈 belangrijk in Next 15
  const supabase = getSupabase();

  const { data: statusRow, error } = await supabase
    .from("tag_status")
    .select("*")
    .eq("short", short)
    .maybeSingle();

  // ...rest van je component ongewijzigd
}

  if (error) {
    return (
      <main className="p-6 max-w-xl mx-auto">
        <h1 className="text-2xl font-bold">Tag: {short}</h1>
        <p className="mt-4 text-red-600">Error: {error.message}</p>
      </main>
    );
  }

  if (!statusRow) {
    return (
      <main className="p-6 max-w-xl mx-auto">
        <h1 className="text-2xl font-bold">Tag niet gevonden</h1>
        <p className="mt-2 text-gray-600">
          Deze tag (<code>{short}</code>) bestaat niet of is nog niet geactiveerd.
        </p>
      </main>
    );
  }

  const { active, unique_scans_30d, last_scan_at } = statusRow;

  return (
    <main className="p-6 max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Tag: {short}</h1>

      <div className="rounded-xl border p-4">
        <p>
          Abonnement:{" "}
          <span className={active ? "text-green-600" : "text-red-600"}>
            {active ? "Actief ✅" : "Niet actief ❌"}
          </span>
        </p>
        <p className="mt-1">Unieke scans (30 dagen): {unique_scans_30d}</p>
        <p className="mt-1">
          Laatste scan:{" "}
          {last_scan_at ? new Date(last_scan_at).toLocaleString() : "–"}
        </p>
      </div>

      {/* client component die de scan logt */}
      <ScanLogger short={short} />
    </main>
  );
}

