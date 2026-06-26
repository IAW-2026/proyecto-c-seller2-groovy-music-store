import { prisma } from "@/lib/prisma";
import { desactivarProductoAdmin, activarProductoAdmin } from "./actions";
import Paginacion from "@/components/Paginacion";
import BotonConfirmacion from "@/components/BotonConfirmacion";

const LIMITE = 4;

export default async function AdminProductosPage({
  searchParams,
}: {
  searchParams: Promise<{ pagina?: string }>;
}) {
  const { pagina: paginaParam } = await searchParams;
  const pagina = Number(paginaParam) || 1;

  const [productos, total] = await Promise.all([
    prisma.producto.findMany({
      orderBy: { created_at: "desc" },
      include: { vendedor: true },
      skip: (pagina - 1) * LIMITE,
      take: LIMITE,
    }),
    prisma.producto.count(),
  ]);

  const totalPaginas = Math.ceil(total / LIMITE);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-cormorant text-4xl font-light">Todos los productos</h1>
        <p className="font-dm text-sm text-medium mt-1">
          {total} producto{total !== 1 ? "s" : ""} en el sistema
        </p>
      </div>

      <div className="grid gap-3">
        {productos.map((producto) => (
          <div
            key={producto.id}
            className="bg-card border border-border rounded-xl p-5 flex justify-between items-center"
          >
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-syne font-semibold text-foreground">
                  {producto.titulo}
                </h2>
                {!producto.activo && (
                  <span className="font-dm text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                    Desactivado
                  </span>
                )}
              </div>
              <p className="font-dm text-sm text-medium mt-0.5">
                {producto.artista} — {producto.formato}
              </p>
              <p className="font-dm text-xs text-medium mt-0.5">
                Vendedor: {producto.vendedor.clerk_user_id}
              </p>
              <p className="font-dm text-sm text-foreground mt-1">
                ${producto.precio.toString()} · Stock: {producto.stock}
              </p>
            </div>

            {producto.activo ? (
              <BotonConfirmacion
                action={desactivarProductoAdmin.bind(null, producto.id)}
                label="Desactivar"
                titulo="Desactivar producto"
                mensaje={`¿Seguro que querés desactivar "${producto.titulo}"? Dejará de aparecer en el catálogo, pero podés reactivarlo después.`}
                confirmLabel="Desactivar"
                variant="primary"
              />
            ) : (
              <BotonConfirmacion
                action={activarProductoAdmin.bind(null, producto.id)}
                label="Activar"
                titulo="Activar producto"
                mensaje={`¿Querés volver a activar "${producto.titulo}"? Volverá a aparecer en el catálogo.`}
                confirmLabel="Activar"
                variant="success"
              />
            )}
          </div>
        ))}
      </div>

      <Paginacion paginaActual={pagina} totalPaginas={totalPaginas} />
    </div>
  );
}