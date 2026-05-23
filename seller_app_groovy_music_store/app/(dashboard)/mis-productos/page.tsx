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
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-cormorant text-4xl font-light">Mis Productos</h1>
          <p className="font-dm text-sm text-medium mt-1">
            {productos.length} producto{productos.length !== 1 ? "s" : ""} publicado{productos.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/mis-productos/nuevo"
          className="font-dm text-sm bg-foreground text-white px-5 py-2.5 rounded hover:opacity-90 transition-opacity"
        >
          + Nuevo producto
        </Link>
      </div>

      {productos.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-12 text-center">
          <p className="font-cormorant text-2xl text-medium">
            No tenés productos publicados todavía
          </p>
          <Link
            href="/mis-productos/nuevo"
            className="font-dm text-sm text-primary hover:underline mt-3 inline-block"
          >
            Publicar primer producto →
          </Link>
        </div>
      ) : (
        <div className="grid gap-3">
          {productos.map((producto) => (
            <div
              key={producto.id}
              className="bg-card border border-border rounded-xl p-5 flex justify-between items-center hover:shadow-sm transition-shadow"
            >
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
              <Link
                href={`/mis-productos/${producto.id}/editar`}
                className="font-dm text-sm border border-border px-4 py-1.5 rounded hover:bg-background transition-colors"
              >
                Editar
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}