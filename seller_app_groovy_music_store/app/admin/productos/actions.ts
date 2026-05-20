"use server";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function desactivarProductoAdmin(id: string) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const adminIds = process.env.ADMIN_USER_IDS?.split(",") ?? [];
  if (!adminIds.includes(userId)) redirect("/dashboard");

  await prisma.producto.update({
    where: { id },
    data: { activo: false },
  });

  redirect("/admin/productos");
}