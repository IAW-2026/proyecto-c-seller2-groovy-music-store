import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

function getAdminIds(): string[] {
  return process.env.ADMIN_USER_IDS
    ?.split(",")
    .map((id) => id.trim())
    .filter(Boolean) ?? [];
}

export function esAdmin(userId: string): boolean {
  return getAdminIds().includes(userId?.trim());
}

export async function requireAdmin(): Promise<string> {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  if (!esAdmin(userId)) redirect("/dashboard");
  return userId;
}

export async function checkAdminApi(): Promise<string | null> {
  const { userId } = await auth();
  if (!userId) return null;
  if (!esAdmin(userId)) return null;
  return userId;
}