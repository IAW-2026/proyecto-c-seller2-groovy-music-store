"use server";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { perfilSchema } from "@/lib/validations";

type FormState = {
  errors?: {
    nombre?: string[];
    direccion?: string[];
    codigo_postal?: string[];
  };
  message?: string;
  success?: boolean;
};

export async function actualizarPerfil(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const parsed = perfilSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors as FormState["errors"] };
  }
  const datos = parsed.data;

  try {
    await prisma.perfilVendedor.upsert({
      where: { clerk_user_id: userId },
      create: {
        clerk_user_id: userId,
        nombre: datos.nombre,
        descripcion: datos.descripcion || null,
        direccion: datos.direccion,
        codigo_postal: datos.codigo_postal,
      },
      update: {
        nombre: datos.nombre,
        descripcion: datos.descripcion || null,
        direccion: datos.direccion,
        codigo_postal: datos.codigo_postal,
      },
    });
  } catch {
    return { message: "Error al guardar. Intentá de nuevo.", success: false };
  }

  return { message: "Perfil actualizado correctamente.", success: true };
}