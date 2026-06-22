import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { avanzarEstado } from "./actions";
import Paginacion from "@/components/Paginacion";

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

const LIMITE = 5;

export default async function MisVentasPage({
  searchParams,
}: {
  searchParams: Promise<{ pagina?: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { pagina: paginaParam } = await searchParams;
  const pagina = Number(paginaParam) || 1;

  const where = { producto: { seller_id: userId } };

  const [ventas, total] = await Promise.all([
    prisma.venta.findMany({
      where,
      include: { producto: true },
      orderBy: { created_at: "desc" },
      skip: (pagina - 1) * LIMITE,
      take: LIMITE,
    }),
    prisma.venta.count({ where }),
  ]);

  const totalPaginas = Math.ceil(total / LIMITE);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-cormorant text-4xl font-light">Mis Ventas</h1>
        <p className="font-dm text-sm text-medium mt-1">
          {total} venta{total !== 1 ? "s" : ""} registrada{total !== 1 ? "s" : ""}
        </p>
      </div>

      {total === 0 ? (
        <div className="bg-card border border-border rounded-xl p-12 text-center">
          <p className="font-cormorant text-2xl text-medium">
            No tenés ventas todavía
          </p>
          <p className="font-dm text-sm text-medium mt-2">
            Las ventas aparecen cuando un comprador confirma una orden
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-3">
            {ventas.map((venta) => (
              <div
                key={venta.id}
                className="bg-card border border-border rounded-xl p-5 flex justify-between items-center"
              >
                <div>
                  <h2 className="font-syne font-semibold text-foreground">
                    {venta.producto.titulo}
                  </h2>
                  <p className="font-dm text-sm text-medium mt-0.5">
                    Cantidad: {venta.cantidad} · ${venta.precio_unitario.toString()} c/u
                  </p>
                  <p className="font-dm text-xs text-medium mt-0.5">
                    Orden: {venta.order_id_externo}
                  </p>
                  <span className={`inline-block mt-2 font-dm text-xs px-2.5 py-1 rounded-full font-medium ${colorEstado[venta.estado_preparacion]}`}>
                    {etiquetaEstado[venta.estado_preparacion]}
                  </span>
                </div>

                {venta.estado_preparacion !== "ENVIADO" && (
                  <form action={avanzarEstado.bind(null, venta.id)}>
                    <button
                      type="submit"
                      className="font-dm text-sm border border-border px-4 py-2 rounded-lg hover:bg-background transition-colors"
                    >
                      Avanzar →
                    </button>
                  </form>
                )}
              </div>
            ))}
          </div>

          <Paginacion paginaActual={pagina} totalPaginas={totalPaginas} />
        </>
      )}
    </div>
  );
}