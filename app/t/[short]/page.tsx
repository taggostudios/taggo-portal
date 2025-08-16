import React from 'react';

type PageProps = { params: { short: string } };

export default function Page({ params }: PageProps) {
  return (
    <main className="min-h-dvh p-8">
      <div className="max-w-xl space-y-4">
        <h1 className="text-2xl font-semibold">Tag status</h1>
        <div className="rounded-lg border p-4">
          <p><strong>Tag:</strong> {params.short}</p>
          <p><strong>Abonnement actief:</strong> <span className="inline-block rounded bg-yellow-100 px-2 py-0.5">onbekend</span></p>
          <p className="text-sm text-gray-600">(Later vullen we dit met Supabase-data)</p>
        </div>
      </div>
    </main>
  );
}
