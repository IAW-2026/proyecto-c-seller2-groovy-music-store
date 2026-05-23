import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const producto = await prisma.producto.findUnique({
    where: { id, activo: true },
  });

  if (!producto) {
    return NextResponse.json(
      { error: "Producto no encontrado" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    ...producto,
    precio: producto.precio.toString(),
    seller_id: { id: producto.seller_id },
  });
}