import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const [totalProductos, totalVentas, ventasPendientes, ventasEnviadas, itemsVendidos] =
    await Promise.all([
      prisma.producto.count({ where: { seller_id: userId, activo: true } }),
      prisma.venta.count({ where: { seller_id: userId } }),
      prisma.venta.count({ where: { seller_id: userId, estado_preparacion: "PENDIENTE" } }),
      prisma.venta.count({ where: { seller_id: userId, estado_preparacion: "ENVIADO" } }),
      prisma.itemVenta.findMany({
        where: { venta: { seller_id: userId } },
        select: { precio_unit: true, cantidad: true },
      }),
    ]);

  const totalIngresos = itemsVendidos.reduce(
    (acc, i) => acc + Number(i.precio_unit) * i.cantidad,
    0
  );

  const stats = [
    { label: "Productos activos", value: totalProductos, icon: "◉" },
    { label: "Ventas totales", value: totalVentas, icon: "◎" },
    { label: "Pendientes", value: ventasPendientes, icon: "⏳" },
    { label: "Enviados", value: ventasEnviadas, icon: "✓" },
  ];

  return (
    <div>
      <h1 className="font-cormorant text-4xl font-light mb-1">Inicio</h1>
      <p className="font-dm text-sm text-medium mb-8">Resumen de tu actividad</p>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-card border border-border rounded-xl p-5 hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <p className="font-dm text-xs text-medium uppercase tracking-wide">{stat.label}</p>
              <span className="text-medium">{stat.icon}</span>
            </div>
            <p className="font-cormorant text-4xl font-light text-foreground">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-foreground rounded-xl p-6 text-white">
        <p className="font-dm text-xs text-white/50 uppercase tracking-wide mb-2">Ingresos totales</p>
        <p className="font-cormorant text-5xl font-light">
          ${totalIngresos.toLocaleString("es-AR")}
        </p>
      </div>
    </div>
  );
}