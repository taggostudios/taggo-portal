import ScanLogger from "./ScanLogger";

export default async function Page({
  params,
}: {
  params: Promise<{ short: string }>;
}) {
  const { short } = await params;

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">Tag: {short}</h1>
      <p className="text-gray-600">Resolver online ✅</p>
      <ScanLogger short={short} />
    </main>
  );
}
