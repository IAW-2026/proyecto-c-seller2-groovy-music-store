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

export async function crearProducto(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const titulo = formData.get("titulo") as string;
  const artista = formData.get("artista") as string;
  const descripcion = formData.get("descripcion") as string;
  const genero = formData.get("genero") as string;
  const formato = formData.get("formato") as string;
  const condicion = formData.get("condicion") as string;
  const precio = formData.get("precio") as string;
  const stock = formData.get("stock") as string;

  // Validación server-side
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
    // Crear perfil del vendedor si no existe
    await prisma.perfilVendedor.upsert({
      where: { clerk_user_id: userId },
      create: { clerk_user_id: userId },
      update: {},
    });

    await prisma.producto.create({
      data: {
        seller_id: userId,
        titulo: titulo.trim(),
        artista: artista.trim(),
        descripcion: descripcion?.trim() || null,
        genero: genero.trim(),
        formato: formato as "VINILO" | "CD" | "CASSETTE" | "MERCHANDISE" | "OTRO",
        condicion: condicion as "NUEVO" | "COMO_NUEVO" | "BUENO" | "ACEPTABLE",
        precio: Number(precio),
        stock: Number(stock),
        imagenes: [],
      },
    });
  } catch (error) {
    return { message: "Error al guardar el producto. Intentá de nuevo." };
  }

  redirect("/mis-productos");
}