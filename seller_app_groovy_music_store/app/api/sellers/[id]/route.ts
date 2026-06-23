import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Auth: API key (Etapa 2) o Bearer JWT (Etapa 3), igual que el resto de las APIs
  const apiKey = request.headers.get("X-API-Key");
  const authHeader = request.headers.get("Authorization");
  const apiKeyValida = apiKey === process.env.BUYER_APP_API_KEY;
  const tieneAuth = authHeader?.startsWith("Bearer ");

  if (!apiKeyValida && !tieneAuth) {
    return NextResponse.json(
      { error: "no_autorizado", mensaje: "Falta autenticación." },
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