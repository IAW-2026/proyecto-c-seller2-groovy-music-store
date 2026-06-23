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

  const venta = await prisma.venta.findUnique({ where: { id: ventaId } });
  if (!venta || venta.seller_id !== userId) return;

  const siguiente = estadoSiguiente[venta.estado_preparacion];
  if (!siguiente) return;

  await prisma.venta.update({
    where: { id: ventaId },
    data: { estado_preparacion: siguiente },
  });

  if (siguiente === "ENVIADO") {
    const envioData = await crearEnvioEnShipping({
      order_id: venta.order_id_externo,
      seller_id: venta.seller_id,
      buyer_id: venta.buyer_id_externo,
      direccionDestino: {
        // TODO (feature 2): dirección real del buyer + del seller
        ciudad: "Buenos Aires",
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