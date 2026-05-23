import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const { userId } = await auth();
  const user = await currentUser();

  const [totalProductos, totalVentas] = await Promise.all([
    prisma.producto.count({ where: { seller_id: userId!, activo: true } }),
    prisma.venta.count({ where: { producto: { seller_id: userId! } } }),
  ]);

  return (
    <div>
      <h1 className="font-cormorant text-4xl font-light mb-1">
        Bienvenido, {user?.firstName}
      </h1>
      <p className="font-dm text-sm text-medium mb-8">
        Panel del vendedor
      </p>

      <div className="grid grid-cols-2 gap-4 max-w-lg">
        <div className="bg-card border border-border rounded-xl p-6">
          <p className="font-syne text-3xl font-bold text-foreground">
            {totalProductos}
          </p>
          <p className="font-dm text-sm text-medium mt-1">
            Productos activos
          </p>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <p className="font-syne text-3xl font-bold text-foreground">
            {totalVentas}
          </p>
          <p className="font-dm text-sm text-medium mt-1">
            Ventas totales
          </p>
        </div>
      </div>
    </div>
  );
}