import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-900 text-white p-6 flex flex-col gap-4">
        <h1 className="text-xl font-bold">Groovy Music Store</h1>
        <nav className="flex flex-col gap-2">
          <a href="/dashboard" className="hover:text-gray-300">Inicio</a>
          <a href="/mis-productos" className="hover:text-gray-300">Mis productos</a>
          <a href="/mis-ventas" className="hover:text-gray-300">Mis ventas</a>
          <a href="/balance" className="hover:text-gray-300">Balance</a>
        </nav>
      </aside>
      <main className="flex-1 p-8 bg-gray-50">
        {children}
      </main>
    </div>
  );
}