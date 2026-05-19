import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function MisProductosPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const productos = await prisma.producto.findMany({
    where: { seller_id: userId, activo: true },
    orderBy: { created_at: "desc" },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mis Productos</h1>
        <Link
          href="/mis-productos/nuevo"
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          + Nuevo producto
        </Link>
      </div>

      {productos.length === 0 ? (
        <p className="text-gray-500">No tenés productos publicados todavía.</p>
      ) : (
        <div className="grid gap-4">
          {productos.map((producto) => (
            <div
              key={producto.id}
              className="border rounded p-4 flex justify-between items-center bg-white"
            >
              <div>
                <h2 className="font-semibold">{producto.titulo}</h2>
                <p className="text-sm text-gray-500">
                  {producto.artista} — {producto.formato}
                </p>
                <p className="text-sm">
                  ${producto.precio.toString()} · Stock: {producto.stock}
                </p>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/mis-productos/${producto.id}/editar`}
                  className="text-sm border px-3 py-1 rounded hover:bg-gray-100"
                >
                  Editar
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}