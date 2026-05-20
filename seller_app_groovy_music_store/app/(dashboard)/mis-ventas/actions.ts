"use server";

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

  await prisma.venta.update({
    where: { id: ventaId },
    data: { estado_preparacion: siguiente },
  });

  redirect("/mis-ventas");
}