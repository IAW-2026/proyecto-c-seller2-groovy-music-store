"use server";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

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

  const titulo = formData.get("titulo") as string;
  const artista = formData.get("artista") as string;
  const descripcion = formData.get("descripcion") as string;
  const genero = formData.get("genero") as string;
  const formato = formData.get("formato") as string;
  const condicion = formData.get("condicion") as string;
  const precio = formData.get("precio") as string;
  const stock = formData.get("stock") as string;
  const imagenesRaw = formData.get("imagenes") as string;
  const imagenes = imagenesRaw ? JSON.parse(imagenesRaw) : producto.imagenes;

  const errors: FormState["errors"] = {};

  if (!titulo || titulo.trim() === "") {
    errors.titulo = ["El título es obligatorio"];
  }
  if (!artista || artista.trim() === "") {
    errors.artista = ["El artista es obligatorio"];
  }
  if (!precio || isNaN(Number(precio)) || Number(precio) <= 0) {
    errors.precio = ["El precio debe ser un número mayor a 0"];
  }
  if (!stock || isNaN(Number(stock)) || Number(stock) < 0) {
    errors.stock = ["El stock debe ser un número mayor o igual a 0"];
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  try {
    await prisma.producto.update({
      where: { id },
      data: {
        titulo: titulo.trim(),
        artista: artista.trim(),
        descripcion: descripcion?.trim() || null,
        genero: genero.trim(),
        formato: formato as "VINILO" | "CD" | "CASSETTE" | "MERCHANDISE" | "OTRO",
        condicion: condicion as "NUEVO" | "COMO_NUEVO" | "BUENO" | "ACEPTABLE",
        precio: Number(precio),
        stock: Number(stock),
        imagenes: imagenes,
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