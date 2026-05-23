"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="bg-card border border-border rounded-2xl p-10 max-w-md w-full text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-primary"></div>

        <p className="font-cormorant text-8xl font-light text-primary mb-2">
          Error
        </p>
        <h1 className="font-syne text-2xl font-semibold text-foreground mb-3">
          Algo salió mal
        </h1>
        <p className="font-dm text-sm text-medium mb-8">
          Ocurrió un error inesperado. Podés intentar de nuevo o volver al panel.
        </p>

        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="font-dm text-sm border border-border px-5 py-2.5 rounded-lg hover:bg-background transition-colors"
          >
            Intentar de nuevo
          </button>
          <Link
            href="/dashboard"
            className="font-dm text-sm bg-foreground text-white px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity"
          >
            Volver al panel
          </Link>
        </div>
      </div>
    </main>
  );
}