import { prisma } from "@/lib/prisma";
import { desactivarProductoAdmin } from "./actions";

export default async function AdminProductosPage() {
  const productos = await prisma.producto.findMany({
    orderBy: { created_at: "desc" },
    include: { vendedor: true },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Todos los productos</h1>
      <div className="grid gap-4">
        {productos.map((producto) => (
          <div
            key={producto.id}
            className="border rounded p-4 bg-white flex justify-between items-center"
          >
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-semibold">{producto.titulo}</h2>
                {!producto.activo && (
                  <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                    Desactivado
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500">
                {producto.artista} — {producto.formato}
              </p>
              <p className="text-sm text-gray-500">
                Vendedor: {producto.vendedor.clerk_user_id}
              </p>
              <p className="text-sm">
                ${producto.precio.toString()} · Stock: {producto.stock}
              </p>
            </div>
            {producto.activo && (
              <form action={desactivarProductoAdmin.bind(null, producto.id)}>
                <button
                  type="submit"
                  className="text-sm text-red-500 border border-red-500 px-3 py-1 rounded hover:bg-red-50"
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