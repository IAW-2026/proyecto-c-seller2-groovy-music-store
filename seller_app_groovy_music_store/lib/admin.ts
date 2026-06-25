import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const ADMIN_ROLES = ["admin", "super_admin"];

// Fallback temporal: mientras se confirma que el metadata de Clerk
// está bien seteado, seguimos aceptando también el mecanismo viejo.
// TODO: quitar esta función y ADMIN_USER_IDS una vez confirmado el rol de Clerk.
function getAdminIdsFallback(): string[] {
  return process.env.ADMIN_USER_IDS?.split(",").map((id) => id.trim()) ?? [];
}

export async function esAdmin(userId: string): Promise<boolean> {
  if (getAdminIdsFallback().includes(userId)) return true;

  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const roles = user.publicMetadata?.roles as string[] | undefined;
    return Array.isArray(roles) && roles.some((r) => ADMIN_ROLES.includes(r));
  } catch (error) {
    console.error("[admin] Error al consultar metadata de Clerk:", error);
    return false; // fail-closed: si no podemos confirmar, no es admin
  }
}

export async function requireAdmin(): Promise<string> {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  if (!(await esAdmin(userId))) redirect("/dashboard");
  return userId;
}

export async function checkAdminApi(): Promise<string | null> {
  const { userId } = await auth();
  if (!userId) return null;
  if (!(await esAdmin(userId))) return null;
  return userId;
}