import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { verificarJWTEntrante } from "@/lib/jwt";
import { productoAdminPatchSchema } from "@/lib/validations";

// PATCH: editar campos y/o suspender/reactivar (activo) desde el Control Plane.
export async function PATCH(
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

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json(
      { error: "body_invalido", mensaje: "El cuerpo debe ser JSON válido" },
      { status: 400 }
    );
  }

  const parsed = productoAdminPatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validacion", detalles: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  if (Object.keys(parsed.data).length === 0) {
    return NextResponse.json(
      { error: "sin_cambios", mensaje: "No se envió ningún campo para actualizar" },
      { status: 400 }
    );
  }

  const existe = await prisma.producto.findUnique({ where: { id } });
  if (!existe) {
    return NextResponse.json(
      { error: "no_encontrado", mensaje: "Producto no encontrado" },
      { status: 404 }
    );
  }

  const actualizado = await prisma.producto.update({
    where: { id },
    data: parsed.data,
  });

  return NextResponse.json({
    datos: { ...actualizado, precio: Number(actualizado.precio) },
  });
}

// DELETE: borrado lógico. NO borramos la fila porque Producto está referenciado
// por ItemVenta/ItemReserva (FK) y perderíamos el historial de ventas. Mismo
// criterio que el botón "Eliminar" del panel: marcar activo: false.
export async function DELETE(
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

  const existe = await prisma.producto.findUnique({ where: { id } });
  if (!existe) {
    return NextResponse.json(
      { error: "no_encontrado", mensaje: "Producto no encontrado" },
      { status: 404 }
    );
  }

  await prisma.producto.update({ where: { id }, data: { activo: false } });

  return NextResponse.json({
    datos: { id, activo: false },
    mensaje: "Producto desactivado (borrado lógico)",
  });
}