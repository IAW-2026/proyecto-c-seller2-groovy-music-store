"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export default function Paginacion({
  paginaActual,
  totalPaginas,
}: {
  paginaActual: number;
  totalPaginas: number;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPaginas <= 1) return null;

  const hrefPagina = (n: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("pagina", String(n));
    return `${pathname}?${params.toString()}`;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      {paginaActual > 1 ? (
        <Link
          href={hrefPagina(paginaActual - 1)}
          className="font-dm text-sm border border-border px-4 py-2 rounded-lg hover:bg-card transition-colors"
        >
          ← Anterior
        </Link>
      ) : (
        <span className="font-dm text-sm border border-border/50 text-medium/40 px-4 py-2 rounded-lg cursor-not-allowed">
          ← Anterior
        </span>
      )}

      <span className="font-dm text-sm text-medium px-4">
        Página {paginaActual} de {totalPaginas}
      </span>

      {paginaActual < totalPaginas ? (
        <Link
          href={hrefPagina(paginaActual + 1)}
          className="font-dm text-sm border border-border px-4 py-2 rounded-lg hover:bg-card transition-colors"
        >
          Siguiente →
        </Link>
      ) : (
        <span className="font-dm text-sm border border-border/50 text-medium/40 px-4 py-2 rounded-lg cursor-not-allowed">
          Siguiente →
        </span>
      )}
    </div>
  );
}