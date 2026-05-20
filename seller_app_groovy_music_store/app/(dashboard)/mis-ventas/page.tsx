import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { avanzarEstado } from "./actions";

const etiquetaEstado = {
  PENDIENTE: "Pendiente",
  PREPARANDO: "Preparando",
  LISTO_PARA_ENVIO: "Listo para envío",
  ENVIADO: "Enviado",
};

const colorEstado = {
  PENDIENTE: "bg-yellow-100 text-yellow-800",
  PREPARANDO: "bg-blue-100 text-blue-800",
  LISTO_PARA_ENVIO: "bg-purple-100 text-purple-800",
  ENVIADO: "bg-green-100 text-green-800",
};

export default async function MisVentasPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const ventas = await prisma.venta.findMany({
    where: { producto: { seller_id: userId } },
    include: { producto: true },
    orderBy: { created_at: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Mis Ventas</h1>

      {ventas.length === 0 ? (
        <p className="text-gray-500">No tenés ventas todavía.</p>
      ) : (
        <div className="grid gap-4">
          {ventas.map((venta) => (
            <div
              key={venta.id}
              className="border rounded p-4 bg-white flex justify-between items-center"
            >
              <div>
                <h2 className="font-semibold">{venta.producto.titulo}</h2>
                <p className="text-sm text-gray-500">
                  Cantidad: {venta.cantidad} · Precio unitario: ${venta.precio_unitario.toString()}
                </p>
                <p className="text-sm text-gray-500">
                  Orden: {venta.order_id_externo}
                </p>
                <span
                  className={`inline-block mt-1 text-xs px-2 py-1 rounded-full font-medium ${colorEstado[venta.estado_preparacion]}`}
                >
                  {etiquetaEstado[venta.estado_preparacion]}
                </span>
              </div>

              {venta.estado_preparacion !== "ENVIADO" && (
                <form action={avanzarEstado.bind(null, venta.id)}>
                  <button
                    type="submit"
                    className="text-sm border px-3 py-1 rounded hover:bg-gray-100"
                  >
                    Avanzar estado →
                  </button>
                </form>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}