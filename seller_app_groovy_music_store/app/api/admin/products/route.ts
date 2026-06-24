import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { verificarJWTEntrante } from "@/lib/jwt";

export async function GET(request: NextRequest) {
  const autorizado = await verificarJWTEntrante(request);
  if (!autorizado) {
    return NextResponse.json(
      { error: "unauthorized", mensaje: "Token ausente o inválido" },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const sellerId = searchParams.get("sellerId") ?? undefined;
  const activoParam = searchParams.get("activo"); // "true" | "false" | null
  const pagina = Number(searchParams.get("pagina")) || 1;
  const limite = Number(searchParams.get("limite")) || 20;

  const where = {
    seller_id: sellerId ?? undefined,
    activo:
      activoParam === "true" ? true : activoParam === "false" ? false : undefined,
  };

  const [productos, total] = await Promise.all([
    prisma.producto.findMany({
      where,
      orderBy: { created_at: "desc" },
      skip: (pagina - 1) * limite,
      take: limite,
      include: {
        vendedor: { select: { clerk_user_id: true, nombre: true } },
      },
    }),
    prisma.producto.count({ where }),
  ]);

  return NextResponse.json({
    datos: productos.map((p) => ({
      id: p.id,
      titulo: p.titulo,
      artista: p.artista,
      descripcion: p.descripcion,
      genero: p.genero,
      formato: p.formato,
      condicion: p.condicion,
      precio: Number(p.precio), // Decimal -> number
      stock: p.stock,
      imagenes: p.imagenes,
      activo: p.activo,
      created_at: p.created_at,
      vendedor: { id: p.vendedor.clerk_user_id, nombre: p.vendedor.nombre },
    })),
    paginacion: {
      pagina,
      limite,
      total,
      totalPaginas: Math.ceil(total / limite),
    },
  });
}