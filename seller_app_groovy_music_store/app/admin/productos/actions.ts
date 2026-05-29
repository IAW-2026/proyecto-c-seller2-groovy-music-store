"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { checkAdminApi } from "@/lib/admin";

export async function desactivarProductoAdmin(id: string) {
  const userId = await checkAdminApi();
  if (!userId) redirect("/dashboard");

  await prisma.producto.update({
    where: { id },
    data: { activo: false },
  });

  redirect("/admin/productos");
}