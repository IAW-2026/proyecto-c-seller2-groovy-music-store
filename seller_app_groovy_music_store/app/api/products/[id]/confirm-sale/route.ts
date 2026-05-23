import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Verificar API key de la Buyer App
  const apiKey = request.headers.get("X-API-Key");
  if (apiKey !== process.env.BUYER_APP_API_KEY) {
    return NextResponse.json(
      { error: "No autorizado" },
      { status: 401 }
    );
  }

  const { id } = await params;
  const body = await request.json();
  const { order_id, buyer_id, cantidad = 1 } = body;

  if (!order_id || !buyer_id) {
    return NextResponse.json(
      { error: "order_id y buyer_id son requeridos" },
      { status: 400 }
    );
  }

  const producto = await prisma.producto.findUnique({
    where: { id, activo: true },
  });

  if (!producto) {
    return NextResponse.json(
      { error: "Producto no encontrado" },
      { status: 404 }
    );
  }

  if (producto.stock < cantidad) {
    return NextResponse.json(
      { error: "Stock insuficiente" },
      { status: 409 }
    );
  }

  const venta = await prisma.$transaction(async (tx) => {
    await tx.producto.update({
      where: { id },
      data: { stock: { decrement: cantidad } },
    });

    return tx.venta.create({
      data: {
        product_id: id,
        order_id_externo: order_id,
        buyer_id_externo: buyer_id,
        cantidad,
        precio_unitario: producto.precio,
        estado_preparacion: "PENDIENTE",
      },
    });
  });

  return NextResponse.json({
    ventaId: venta.id,
    estado: "confirmada",
    producto: {
      id: producto.id,
      titulo: producto.titulo,
      stockRestante: producto.stock - cantidad,
    },
  });
}