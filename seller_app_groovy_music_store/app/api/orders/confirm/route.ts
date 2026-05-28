import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  // Auth: acepta API key (Etapa 2) o JWT (Etapa 3)
  const apiKey = request.headers.get("X-API-Key");
  const authHeader = request.headers.get("Authorization");

  const apiKeyValida = apiKey === process.env.BUYER_APP_API_KEY;
  const tieneAuth = authHeader?.startsWith("Bearer ");

  if (!apiKeyValida && !tieneAuth) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const body = await request.json();
  const { order_id, buyer_id, seller_id, items } = body;

  if (!order_id || !buyer_id || !seller_id || !items?.length) {
    return NextResponse.json(
      { error: "Faltan campos requeridos" },
      { status: 400 }
    );
  }

  // Verificar que existe la reserva activa
  const reserva = await prisma.reserva.findUnique({
    where: { order_id_externo: order_id },
  });
  if (!reserva || reserva.estado !== "ACTIVA") {
    return NextResponse.json(
      { error: "No existe una reserva activa para esta orden" },
      { status: 404 }
    );
  }

  // Crear ventas y confirmar reserva en una transacción
  const ventas = await prisma.$transaction(async (tx) => {
    // Actualizar estado de la reserva
    await tx.reserva.update({
      where: { order_id_externo: order_id },
      data: { estado: "CONFIRMADA" },
    });

    // Crear una venta por cada ítem
    const ventasCreadas = await Promise.all(
      items.map((item: {
        producto_id: string;
        cantidad: number;
        precio_unit: number;
      }) =>
        tx.venta.create({
          data: {
            product_id: item.producto_id,
            order_id_externo: order_id,
            buyer_id_externo: buyer_id,
            cantidad: item.cantidad,
            precio_unitario: item.precio_unit,
            estado_preparacion: "PENDIENTE",
          },
        })
      )
    );

    return ventasCreadas;
  });

  return NextResponse.json({
    estado: "confirmada",
    ventas: ventas.map((v) => ({
      ventaId: v.id,
      producto_id: v.product_id,
      cantidad: v.cantidad,
    })),
  });
}