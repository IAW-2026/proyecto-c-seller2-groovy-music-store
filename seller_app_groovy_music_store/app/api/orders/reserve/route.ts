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

  // Verificar que no exista ya una reserva para esta orden
  const reservaExistente = await prisma.reserva.findUnique({
    where: { order_id_externo: order_id },
  });
  if (reservaExistente) {
    return NextResponse.json(
      { error: "Ya existe una reserva para esta orden" },
      { status: 409 }
    );
  }

  // Verificar stock de todos los productos antes de reservar
  for (const item of items) {
    const producto = await prisma.producto.findUnique({
      where: { id: item.producto_id, activo: true },
    });
    if (!producto) {
      return NextResponse.json(
        { error: `Producto ${item.producto_id} no encontrado` },
        { status: 404 }
      );
    }
    if (producto.stock < item.cantidad) {
      return NextResponse.json(
        { error: `Stock insuficiente para ${producto.titulo}` },
        { status: 409 }
      );
    }
  }

  // Crear reserva y descontar stock en una transacción
  const reserva = await prisma.$transaction(async (tx) => {
    const nuevaReserva = await tx.reserva.create({
      data: {
        order_id_externo: order_id,
        buyer_id_externo: buyer_id,
        seller_id,
        estado: "ACTIVA",
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
      include: { items: { include: { producto: true } } },
    });

    for (const item of items) {
      await tx.producto.update({
        where: { id: item.producto_id },
        data: { stock: { decrement: item.cantidad } },
      });
    }

    return nuevaReserva;
  });

  return NextResponse.json({
    estado: "reservado",
    items: reserva.items.map((item) => ({
      producto_id: item.product_id,
      titulo: item.producto.titulo,
      stockRestante: item.producto.stock - item.cantidad,
    })),
  });
}