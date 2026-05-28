import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@clerk/nextjs/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authHeader = request.headers.get("Authorization");
  const token = authHeader?.replace("Bearer ", "");
  if (!token) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    await verifyToken(token, { secretKey: process.env.CLERK_SECRET_KEY! });
  } catch {
    return NextResponse.json({ error: "Token inválido" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const { order_id, buyer_id, cantidad = 1, precio_unit } = body;

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

  // Stock ya fue descontado por reserve — solo crear la venta
  const venta = await prisma.venta.create({
    data: {
      product_id: id,
      order_id_externo: order_id,
      buyer_id_externo: buyer_id,
      cantidad,
      precio_unitario: precio_unit ?? producto.precio,
      estado_preparacion: "PENDIENTE",
    },
  });

  return NextResponse.json({
    ventaId: venta.id,
    estado: "confirmada",
    producto: {
      id: producto.id,
      titulo: producto.titulo,
    },
  });
}