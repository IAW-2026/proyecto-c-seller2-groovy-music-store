"use server";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

type FormState = {
  errors?: {
    nombre?: string[];
    direccion?: string[];
    codigo_postal?: string[];
  };
  message?: string;
};

export async function completarPerfil(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const nombre = formData.get("nombre") as string;
  const descripcion = formData.get("descripcion") as string;
  const direccion = formData.get("direccion") as string;
  const codigo_postal = formData.get("codigo_postal") as string;

  const errors: FormState["errors"] = {};

  if (!nombre || nombre.trim() === "") {
    errors.nombre = ["El nombre del negocio es obligatorio"];
  }
  if (!direccion || direccion.trim() === "") {
    errors.direccion = ["La dirección es obligatoria"];
  }
  if (!codigo_postal || codigo_postal.trim() === "") {
    errors.codigo_postal = ["El código postal es obligatorio"];
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  try {
    await prisma.perfilVendedor.upsert({
      where: { clerk_user_id: userId },
      create: {
        clerk_user_id: userId,
        nombre: nombre.trim(),
        descripcion: descripcion?.trim() || null,
        direccion: direccion.trim(),
        codigo_postal: codigo_postal.trim(),
      },
      update: {
        nombre: nombre.trim(),
        descripcion: descripcion?.trim() || null,
        direccion: direccion.trim(),
        codigo_postal: codigo_postal.trim(),
      },
    });
  } catch {
    return { message: "Error al guardar el perfil. Intentá de nuevo." };
  }

  redirect("/dashboard");
}