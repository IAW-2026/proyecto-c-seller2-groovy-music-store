import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { verificarJWTEntrante } from "@/lib/jwt";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  
  const autorizado = await verificarJWTEntrante(request);
  if (!autorizado) {
    return NextResponse.json(
      { error: "unauthorized", mensaje: "Token ausente o inválido" },
      { status: 401 }
    );
  }

  const { id } = await params;

  const vendedor = await prisma.perfilVendedor.findUnique({
    where: { clerk_user_id: id },
  });

  if (!vendedor) {
    return NextResponse.json(
      {
        error: "seller_no_encontrado",
        mensaje: "No se encontró un vendedor asociado al ID proporcionado.",
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    datos: {
      id: vendedor.clerk_user_id,
      nombre_fantasia: vendedor.nombre,
      codigo_postal: vendedor.codigo_postal,
      ciudad: vendedor.ciudad,
      fecha_alta: vendedor.created_at,
    },
  });
}