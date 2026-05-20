import { prisma } from "@/lib/prisma";

export default async function AdminPage() {
  const [totalProductos, totalVentas, totalVendedores] = await Promise.all([
    prisma.producto.count({ where: { activo: true } }),
    prisma.venta.count(),
    prisma.perfilVendedor.count(),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Overview</h1>
      <div className="grid grid-cols-3 gap-4">
        <div className="border rounded p-6 bg-white text-center">
          <p className="text-4xl font-bold">{totalProductos}</p>
          <p className="text-gray-500 mt-1">Productos activos</p>
        </div>
        <div className="border rounded p-6 bg-white text-center">
          <p className="text-4xl font-bold">{totalVentas}</p>
          <p className="text-gray-500 mt-1">Ventas totales</p>
        </div>
        <div className="border rounded p-6 bg-white text-center">
          <p className="text-4xl font-bold">{totalVendedores}</p>
          <p className="text-gray-500 mt-1">Vendedores registrados</p>
        </div>
      </div>
    </div>
  );
}