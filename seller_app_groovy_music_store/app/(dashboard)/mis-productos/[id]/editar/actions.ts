"use server";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { productoSchema } from "@/lib/validations";

type FormState = {
  errors?: {
    titulo?: string[];
    artista?: string[];
    precio?: string[];
    stock?: string[];
  };
  message?: string;
};

export async function editarProducto(
  id: string,
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const producto = await prisma.producto.findUnique({ where: { id } });
  if (!producto || producto.seller_id !== userId) {
    return { message: "No tenés permiso para editar este producto." };
  }

  const parsed = productoSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors as FormState["errors"] };
  }
  const datos = parsed.data;

  const imagenesRaw = formData.get("imagenes") as string;
  const imagenes = imagenesRaw ? JSON.parse(imagenesRaw) : producto.imagenes;

  try {
    await prisma.producto.update({
      where: { id },
      data: {
        titulo: datos.titulo,
        artista: datos.artista,
        descripcion: datos.descripcion || null,
        genero: datos.genero,
        formato: datos.formato,
        condicion: datos.condicion,
        precio: datos.precio,
        stock: datos.stock,
        imagenes,
      },
    });
  } catch {
    return { message: "Error al actualizar el producto. Intentá de nuevo." };
  }

  redirect("/mis-productos");
}

export async function desactivarProducto(id: string) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const producto = await prisma.producto.findUnique({ where: { id } });
  if (!producto || producto.seller_id !== userId) return;

  await prisma.producto.update({
    where: { id },
    data: { activo: false },
  });

  redirect("/mis-productos");
}