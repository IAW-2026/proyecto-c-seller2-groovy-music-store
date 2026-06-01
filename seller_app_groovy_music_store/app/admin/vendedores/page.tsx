// app/admin/vendedores/page.tsx

import { prisma } from "@/lib/prisma";

export default async function AdminVendedoresPage() {
  const vendedores = await prisma.perfilVendedor.findMany({
    orderBy: { clerk_user_id: "asc" },
    include: {
      _count: {
        select: {
          productos: { where: { activo: true } },
        },
      },
      productos: {
        select: {
          _count: {
            select: { ventas: true },
          },
        },
      },
    },
  });

  // Sumar ventas de todos los productos de cada vendedor
  const vendedoresConVentas = vendedores.map((v) => ({
    ...v,
    totalVentas: v.productos.reduce((acc, p) => acc + p._count.ventas, 0),
  }));

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-cormorant text-4xl font-light">Vendedores</h1>
        <p className="font-dm text-sm text-medium mt-1">
          {vendedores.length} vendedor{vendedores.length !== 1 ? "es" : ""} registrado{vendedores.length !== 1 ? "s" : ""}
        </p>
      </div>

      {vendedores.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-12 text-center">
          <p className="font-cormorant text-2xl text-medium">
            No hay vendedores registrados todavía
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {vendedoresConVentas.map((vendedor) => (
            <div
              key={vendedor.clerk_user_id}
              className="bg-card border border-border rounded-xl p-5 flex justify-between items-center"
            >
              <div className="flex flex-col gap-1">
                <h2 className="font-syne font-semibold text-foreground">
                  {vendedor.nombre ?? "Sin nombre"}
                </h2>
                {vendedor.descripcion && (
                  <p className="font-dm text-sm text-medium">
                    {vendedor.descripcion}
                  </p>
                )}
                <p className="font-dm text-xs text-medium mt-0.5">
                  {vendedor.direccion ?? "Sin dirección"}{vendedor.codigo_postal ? ` · CP ${vendedor.codigo_postal}` : ""}
                </p>
                <p className="font-dm text-xs text-medium/60 mt-0.5 font-mono">
                  {vendedor.clerk_user_id}
                </p>
              </div>

              <div className="flex gap-6 text-center shrink-0 ml-6">
                <div>
                  <p className="font-cormorant text-3xl font-light text-foreground">
                    {vendedor._count.productos}
                  </p>
                  <p className="font-dm text-xs text-medium">productos activos</p>
                </div>
                <div>
                  <p className="font-cormorant text-3xl font-light text-foreground">
                    {vendedor.totalVentas}
                  </p>
                  <p className="font-dm text-xs text-medium">ventas</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}