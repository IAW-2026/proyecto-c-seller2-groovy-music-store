import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const adminIds = process.env.ADMIN_USER_IDS?.split(",") ?? [];
  if (!adminIds.includes(userId)) redirect("/dashboard");

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-800 text-white p-6 flex flex-col gap-4">
        <h1 className="text-xl font-bold">Admin Panel</h1>
        <nav className="flex flex-col gap-2">
          <Link href="/admin" className="hover:text-gray-300">Overview</Link>
          <Link href="/admin/productos" className="hover:text-gray-300">Productos</Link>
          <Link href="/dashboard" className="hover:text-gray-300">← Volver al panel</Link>
        </nav>
      </aside>
      <main className="flex-1 p-8 bg-gray-50">
        {children}
      </main>
    </div>
  );
}