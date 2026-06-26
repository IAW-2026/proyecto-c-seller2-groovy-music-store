"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export default function BuscadorProductos() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleBusqueda = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const params = new URLSearchParams(searchParams.toString());
      const valor = e.target.value;

      if (valor) {
        params.set("busqueda", valor);
      } else {
        params.delete("busqueda");
      }
      params.set("pagina", "1");
      router.push(`/mis-productos?${params.toString()}`);
    },
    [router, searchParams]
  );

  return (
    <input
      type="text"
      placeholder="Buscar por título..."
      defaultValue={searchParams.get("busqueda") ?? ""}
      onChange={handleBusqueda}
      className="font-dm w-full border border-border rounded-lg px-4 py-2.5 bg-card focus:outline-none focus:border-foreground transition-colors"
    />
  );
}