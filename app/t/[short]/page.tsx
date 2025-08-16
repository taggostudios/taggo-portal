import ScanLogger from "./ScanLogger"; // exact zo, zonder .tsx


type PageProps = {
  params: {
    short: string;
  };
};

export default function Page({ params }: PageProps) {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">Tag: {params.short}</h1>
      <p className="text-gray-600">Resolver online ✅</p>
      <ScanLogger short={params.short} />
    </main>
  );
}
