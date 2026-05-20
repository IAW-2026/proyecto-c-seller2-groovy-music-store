import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const adminIds = process.env.ADMIN_USER_IDS?.split(",") ?? [];
  const esAdmin = adminIds.includes(userId);

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-900 text-white p-6 flex flex-col gap-4">
        <h1 className="text-xl font-bold">Groovy Music Store</h1>
        <nav className="flex flex-col gap-2">
          <Link href="/dashboard" className="hover:text-gray-300">Inicio</Link>
          <Link href="/mis-productos" className="hover:text-gray-300">Mis productos</Link>
          <Link href="/mis-ventas" className="hover:text-gray-300">Mis ventas</Link>
          <Link href="/balance" className="hover:text-gray-300">Balance</Link>
          {esAdmin && (
            <Link href="/admin" className="hover:text-gray-300 mt-4 text-yellow-400">
              ⚙ Panel Admin
            </Link>
          )}
        </nav>
      </aside>
      <main className="flex-1 p-8 bg-gray-50">
        {children}
      </main>
    </div>
  );
}