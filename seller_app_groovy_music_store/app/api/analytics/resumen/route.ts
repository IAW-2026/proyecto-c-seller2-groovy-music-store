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

  // Agregados de TODO el marketplace (sin filtrar por seller).
  // total_productos cuenta solo activos, igual que el dashboard del vendedor.
  const [totalProductos, totalVentas, itemsVendidos, topAgrupados] =
    await Promise.all([
      prisma.producto.count({ where: { activo: true } }),
      prisma.venta.count(),
      prisma.itemVenta.findMany({
        select: { precio_unit: true, cantidad: true },
      }),
      prisma.itemVenta.groupBy({
        by: ["product_id"],
        _sum: { cantidad: true },
        orderBy: { _sum: { cantidad: "desc" } },
        take: 5,
      }),
    ]);

  // precio_unit es Decimal -> pasar a Number antes de operar/serializar
  const ingresosBrutos = itemsVendidos.reduce(
    (acc, i) => acc + Number(i.precio_unit) * i.cantidad,
    0
  );

  // groupBy solo devuelve el product_id; traemos título y artista aparte
  const idsTop = topAgrupados.map((t) => t.product_id);
  const productosTop = await prisma.producto.findMany({
    where: { id: { in: idsTop } },
    select: { id: true, titulo: true, artista: true },
  });
  const productoMap = new Map(productosTop.map((p) => [p.id, p]));

  const topProductos = topAgrupados.map((t) => ({
    id: t.product_id,
    titulo: productoMap.get(t.product_id)?.titulo ?? "(eliminado)",
    artista: productoMap.get(t.product_id)?.artista ?? "",
    unidades_vendidas: t._sum.cantidad ?? 0,
  }));

  return NextResponse.json({
    datos: {
      total_productos: totalProductos,
      total_ventas: totalVentas,
      ingresos_brutos: ingresosBrutos,
      top_productos: topProductos,
    },
  });
}