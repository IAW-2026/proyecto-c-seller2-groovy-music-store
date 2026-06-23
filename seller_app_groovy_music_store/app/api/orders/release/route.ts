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
  const { order_id, items } = body;

  if (!order_id || !items?.length) {
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

  // Restaurar stock y liberar reserva en una transacción
  const productosActualizados = await prisma.$transaction(async (tx) => {
    await tx.reserva.update({
      where: { order_id_externo: order_id },
      data: { estado: "LIBERADA" },
    });

    const actualizados = await Promise.all(
      items.map(async (item: { producto_id: string; cantidad: number }) => {
        const producto = await tx.producto.update({
          where: { id: item.producto_id },
          data: { stock: { increment: item.cantidad } },
        });
        return {
          producto_id: item.producto_id,
          stockRestante: producto.stock,
        };
      })
    );

    return actualizados;
  });

  return NextResponse.json({
    estado: "liberado",
    items: productosActualizados,
  });
}