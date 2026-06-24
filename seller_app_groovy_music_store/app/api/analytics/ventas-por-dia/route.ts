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
  const desdeParam = searchParams.get("desde");
  const hastaParam = searchParams.get("hasta");

  // Rango por defecto: últimos 30 días si no mandan parámetros
  const ahora = new Date();
  const hasta = hastaParam ? new Date(hastaParam) : ahora;
  const desde = desdeParam
    ? new Date(desdeParam)
    : new Date(ahora.getTime() - 30 * 24 * 60 * 60 * 1000);

  if (isNaN(desde.getTime()) || isNaN(hasta.getTime())) {
    return NextResponse.json(
      { error: "rango_invalido", mensaje: "desde/hasta no son fechas válidas" },
      { status: 400 }
    );
  }
  if (desde > hasta) {
    return NextResponse.json(
      { error: "rango_invalido", mensaje: "desde no puede ser posterior a hasta" },
      { status: 400 }
    );
  }

  // Incluimos todo el día "hasta"
  const hastaFinDia = new Date(hasta);
  hastaFinDia.setHours(23, 59, 59, 999);

  const ventas = await prisma.venta.findMany({
    where: { created_at: { gte: desde, lte: hastaFinDia } },
    select: {
      created_at: true,
      items: { select: { precio_unit: true, cantidad: true } },
    },
    orderBy: { created_at: "asc" },
  });

  // Agrupamos por día en JS. La clave es la fecha en UTC (YYYY-MM-DD).
  const porDia = new Map<string, { cantidad_ventas: number; ingresos: number }>();

  for (const venta of ventas) {
    const dia = venta.created_at.toISOString().slice(0, 10);
    const ingresoVenta = venta.items.reduce(
      (acc, i) => acc + Number(i.precio_unit) * i.cantidad,
      0
    );
    const actual = porDia.get(dia) ?? { cantidad_ventas: 0, ingresos: 0 };
    actual.cantidad_ventas += 1;
    actual.ingresos += ingresoVenta;
    porDia.set(dia, actual);
  }

  const datos = Array.from(porDia.entries())
    .map(([dia, v]) => ({
      dia,
      cantidad_ventas: v.cantidad_ventas,
      ingresos: v.ingresos,
    }))
    .sort((a, b) => a.dia.localeCompare(b.dia));

  return NextResponse.json({
    datos,
    rango: {
      desde: desde.toISOString().slice(0, 10),
      hasta: hasta.toISOString().slice(0, 10),
    },
  });
}