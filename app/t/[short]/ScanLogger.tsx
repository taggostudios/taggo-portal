"use client";

import { useEffect } from "react";

export default function ScanLogger({ short }: { short: string }) {
  useEffect(() => {
    fetch("/api/scan", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ short, deviceHash: "demo" }),
    }).catch(() => {});
  }, [short]);

  return null;
}
