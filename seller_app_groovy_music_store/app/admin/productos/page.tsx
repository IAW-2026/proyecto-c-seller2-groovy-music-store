import { prisma } from "@/lib/prisma";
import { desactivarProductoAdmin } from "./actions";

export default async function AdminProductosPage() {
  const productos = await prisma.producto.findMany({
    orderBy: { created_at: "desc" },
    include: { vendedor: true },
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-cormorant text-4xl font-light">Todos los productos</h1>
        <p className="font-dm text-sm text-medium mt-1">
          {productos.length} producto{productos.length !== 1 ? "s" : ""} en el sistema
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

            {producto.activo && (
              <form action={desactivarProductoAdmin.bind(null, producto.id)}>
                <button
                  type="submit"
                  className="font-dm text-sm text-primary border border-primary/40 px-4 py-1.5 rounded-lg hover:bg-primary/5 transition-colors"
                >
                  Desactivar
                </button>
              </form>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}