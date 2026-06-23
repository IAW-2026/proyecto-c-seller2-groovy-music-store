import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { verificarJWTEntrante } from "@/lib/jwt";

export async function POST(request: NextRequest) {

  const autorizado = await verificarJWTEntrante(request);
  if (!autorizado) {
    return NextResponse.json(
      { error: "unauthorized", mensaje: "Token ausente o inválido" },
      { status: 401 }
    );
  }

  const body = await request.json();
  const { order_id, buyer_id, seller_id, items, direccion_envio } = body;

  if (!order_id || !buyer_id || !seller_id || !items?.length) {
    return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
  }

  const reserva = await prisma.reserva.findUnique({
    where: { order_id_externo: order_id },
  });
  if (!reserva || reserva.estado !== "ACTIVA") {
    return NextResponse.json(
      { error: "No existe una reserva activa para esta orden" },
      { status: 404 }
    );
  }

  const venta = await prisma.$transaction(async (tx) => {
    await tx.reserva.update({
      where: { order_id_externo: order_id },
      data: { estado: "CONFIRMADA" },
    });

    return tx.venta.create({
      data: {
        order_id_externo: order_id,
        buyer_id_externo: buyer_id,
        seller_id,
        direccion_envio: direccion_envio ?? undefined,
        estado_preparacion: "PENDIENTE",
        items: {
          create: items.map((item: {
            producto_id: string;
            cantidad: number;
            precio_unit: number;
          }) => ({
            product_id: item.producto_id,
            cantidad: item.cantidad,
            precio_unit: item.precio_unit,
          })),
        },
      },
      include: { items: true },
    });
  });

  return NextResponse.json({
    estado: "confirmada",
    ventaId: venta.id,
    items: venta.items.map((i) => ({
      producto_id: i.product_id,
      cantidad: i.cantidad,
    })),
  });
}