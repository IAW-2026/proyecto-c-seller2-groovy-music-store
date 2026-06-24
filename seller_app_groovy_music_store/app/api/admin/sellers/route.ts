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
  const pagina = Number(searchParams.get("pagina")) || 1;
  const limite = Number(searchParams.get("limite")) || 20;

  const [vendedores, total, ventasPorVendedor] = await Promise.all([
    prisma.perfilVendedor.findMany({
      orderBy: { created_at: "desc" },
      skip: (pagina - 1) * limite,
      take: limite,
      include: {
        _count: { select: { productos: { where: { activo: true } } } },
      },
    }),
    prisma.perfilVendedor.count(),
    prisma.venta.groupBy({ by: ["seller_id"], _count: { _all: true } }),
  ]);

  const ventasMap = new Map(
    ventasPorVendedor.map((v) => [v.seller_id, v._count._all])
  );

  return NextResponse.json({
    datos: vendedores.map((v) => ({
      id: v.clerk_user_id,
      nombre: v.nombre,
      descripcion: v.descripcion,
      ciudad: v.ciudad,
      provincia: v.provincia,
      codigo_postal: v.codigo_postal,
      fecha_alta: v.created_at,
      productos_activos: v._count.productos,
      total_ventas: ventasMap.get(v.clerk_user_id) ?? 0,
    })),
    paginacion: {
      pagina,
      limite,
      total,
      totalPaginas: Math.ceil(total / limite),
    },
  });
}