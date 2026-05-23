import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { ids } = body;

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json(
      { error: "Se requiere un array de ids" },
      { status: 400 }
    );
  }

  const productos = await prisma.producto.findMany({
    where: {
      id: { in: ids },
      activo: true,
    },
  });

  return NextResponse.json({
    productos: productos.map((p) => ({
      ...p,
      precio: p.precio.toString(),
      seller_id: { id: p.seller_id },
    })),
  });
}