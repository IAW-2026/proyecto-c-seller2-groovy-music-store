import { prisma } from "@/lib/prisma";

export default async function AdminPage() {
  const [totalProductos, totalVentas, totalVendedores] = await Promise.all([
    prisma.producto.count({ where: { activo: true } }),
    prisma.venta.count(),
    prisma.perfilVendedor.count(),
  ]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-cormorant text-4xl font-light">Overview</h1>
        <p className="font-dm text-sm text-medium mt-1">
          Estado general del sistema
        </p>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
        <div className="bg-card border border-border rounded-xl p-6" style={{ flex: "1 1 200px" }}>
          <p className="font-cormorant text-5xl font-light text-foreground">
            {totalProductos}
          </p>
          <p className="font-dm text-sm text-medium mt-2">Productos activos</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-6" style={{ flex: "1 1 200px" }}>
          <p className="font-cormorant text-5xl font-light text-foreground">
            {totalVentas}
          </p>
          <p className="font-dm text-sm text-medium mt-2">Ventas totales</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-6" style={{ flex: "1 1 200px" }}>
          <p className="font-cormorant text-5xl font-light text-foreground">
            {totalVendedores}
          </p>
          <p className="font-dm text-sm text-medium mt-2">Vendedores registrados</p>
        </div>
      </div>
    </div>
  );
}