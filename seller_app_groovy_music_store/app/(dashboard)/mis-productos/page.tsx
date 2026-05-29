import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import BuscadorProductos from "@/components/BuscadorProductos";
import Image from "next/image";


const LIMITE = 4;

export default async function MisProductosPage({
  searchParams,
}: {
  searchParams: Promise<{ busqueda?: string; pagina?: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { busqueda, pagina: paginaParam } = await searchParams;
  const pagina = Number(paginaParam) || 1;

  const where = {
    seller_id: userId,
    activo: true,
    titulo: busqueda
      ? { contains: busqueda, mode: "insensitive" as const }
      : undefined,
  };

  const [productos, total] = await Promise.all([
    prisma.producto.findMany({
      where,
      orderBy: { created_at: "desc" },
      skip: (pagina - 1) * LIMITE,
      take: LIMITE,
    }),
    prisma.producto.count({ where }),
  ]);

  const totalPaginas = Math.ceil(total / LIMITE);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="font-cormorant text-4xl font-light">Mis Productos</h1>
          <p className="font-dm text-sm text-medium mt-1">
            {total} producto{total !== 1 ? "s" : ""} encontrado{total !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/mis-productos/nuevo"
          className="font-dm text-sm bg-foreground text-white px-5 py-2.5 rounded hover:opacity-90 transition-opacity"
        >
          + Nuevo producto
        </Link>
      </div>

      <div className="mb-6">
        <BuscadorProductos />
      </div>

      {productos.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-12 text-center">
          <p className="font-cormorant text-2xl text-medium">
            {busqueda
              ? `No hay productos que coincidan con "${busqueda}"`
              : "No tenés productos publicados todavía"}
          </p>
          {!busqueda && (
            <Link
              href="/mis-productos/nuevo"
              className="font-dm text-sm text-primary hover:underline mt-3 inline-block"
            >
              Publicar primer producto →
            </Link>
          )}
        </div>
      ) : (
        <>
          <div className="grid gap-3">
          {productos.map((producto) => (
            <div
              key={producto.id}
              className="bg-card border border-border rounded-xl p-5 flex justify-between items-center hover:shadow-sm transition-shadow"
            >
              <div className="flex items-center gap-4">
                {producto.imagenes[0] ? (
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-border shrink-0">
                    <Image
                      src={producto.imagenes[0]}
                      alt={producto.titulo}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-lg border border-border bg-background flex items-center justify-center shrink-0">
                    <span className="font-dm text-xs text-medium">Sin foto</span>
                  </div>
                )}
                <div>
                  <h2 className="font-syne font-semibold text-foreground">
                    {producto.titulo}
                  </h2>
                  <p className="font-dm text-sm text-medium mt-0.5">
                    {producto.artista} — {producto.formato}
                  </p>
                  <p className="font-dm text-sm text-foreground mt-1">
                    ${producto.precio.toString()} · Stock: {producto.stock}
                  </p>
                </div>
              </div>
              <Link
                href={`/mis-productos/${producto.id}/editar`}
                className="font-dm text-sm border border-border px-4 py-1.5 rounded hover:bg-background transition-colors"
              >
                Editar
              </Link>
            </div>
          ))}
          </div>

          {totalPaginas > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              {pagina > 1 && (
                <Link
                  href={`/mis-productos?${busqueda ? `busqueda=${busqueda}&` : ""}pagina=${pagina - 1}`}
                  className="font-dm text-sm border border-border px-4 py-2 rounded-lg hover:bg-card transition-colors"
                >
                  ← Anterior
                </Link>
              )}

              <span className="font-dm text-sm text-medium px-4">
                Página {pagina} de {totalPaginas}
              </span>

              {pagina < totalPaginas && (
                <Link
                  href={`/mis-productos?${busqueda ? `busqueda=${busqueda}&` : ""}pagina=${pagina + 1}`}
                  className="font-dm text-sm border border-border px-4 py-2 rounded-lg hover:bg-card transition-colors"
                >
                  Siguiente →
                </Link>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}