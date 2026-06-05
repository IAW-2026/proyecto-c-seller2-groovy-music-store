"use server";

import { crearEnvioEnShipping } from "@/lib/shipping-client";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

const estadoSiguiente = {
  PENDIENTE: "PREPARANDO",
  PREPARANDO: "LISTO_PARA_ENVIO",
  LISTO_PARA_ENVIO: "ENVIADO",
  ENVIADO: null,
} as const;

export async function avanzarEstado(ventaId: string) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const venta = await prisma.venta.findUnique({
    where: { id: ventaId },
    include: { producto: true },
  });

  if (!venta || venta.producto.seller_id !== userId) return;

  const siguiente = estadoSiguiente[venta.estado_preparacion];
  if (!siguiente) return;

  // Siempre avanzar el estado
  await prisma.venta.update({
    where: { id: ventaId },
    data: { estado_preparacion: siguiente },
  });

  if (siguiente === "ENVIADO") {
    const envioData = await crearEnvioEnShipping({
      order_id: venta.order_id_externo,
      seller_id: venta.producto.seller_id,
      buyer_id: venta.buyer_id_externo,
      direccionDestino: {
        // TODO: reemplazar con la dirección real del comprador
        // Opción A: viene en la Venta (si Buyer la manda en /confirm)
        // Opción B: pedirla a Buyer con GET /api/orders/[order_id]
        ciudad: "Buenos Aires",         // ← placeholder hasta definir con Buyer
        provincia: "Buenos Aires",
        cod_postal: "1000",
      },
    });

    if (envioData?.envioId) {
      await prisma.venta.update({
        where: { id: ventaId },
        data: { envio_id_externo: envioData.envioId },
      });
    }
  }
  redirect("/mis-ventas");
}