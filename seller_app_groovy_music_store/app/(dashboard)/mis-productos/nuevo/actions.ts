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

export async function crearProducto(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const parsed = productoSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors as FormState["errors"] };
  }
  const datos = parsed.data;

  const imagenesRaw = formData.get("imagenes") as string;
  const imagenes = imagenesRaw ? JSON.parse(imagenesRaw) : [];

  try {
    await prisma.perfilVendedor.upsert({
      where: { clerk_user_id: userId },
      create: { clerk_user_id: userId },
      update: {},
    });

    await prisma.producto.create({
      data: {
        seller_id: userId,
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
    return { message: "Error al guardar el producto. Intentá de nuevo." };
  }

  redirect("/mis-productos");
}