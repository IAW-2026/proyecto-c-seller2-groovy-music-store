import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const busqueda = searchParams.get("busqueda") ?? undefined;
  const genero = searchParams.get("genero") ?? undefined;
  const formato = searchParams.get("formato") ?? undefined;
  const pagina = Number(searchParams.get("pagina")) || 1;
  const limite = Number(searchParams.get("limite")) || 20;

  const where = {
    activo: true,
    titulo: busqueda
      ? { contains: busqueda, mode: "insensitive" as const }
      : undefined,
    genero: genero ?? undefined,
    formato: formato as "VINILO" | "CD" | "CASSETTE" | "MERCHANDISE" | "OTRO" ?? undefined,
  };

  const [productos, total] = await Promise.all([
    prisma.producto.findMany({
      where,
      skip: (pagina - 1) * limite,
      take: limite,
      select: {
        id: true,
        titulo: true,
        artista: true,
        precio: true,
        stock: true,
        formato: true,
        condicion: true,
        genero: true,
        imagenes: true,
        seller_id: true,
      },
    }),
    prisma.producto.count({ where }),
  ]);

  return NextResponse.json({
    productos: productos.map((p) => ({
      ...p,
      precio: p.precio.toString(),
      seller_id: { id: p.seller_id },
    })),
    paginacion: {
      pagina,
      limite,
      total,
      totalPaginas: Math.ceil(total / limite),
    },
  });
}