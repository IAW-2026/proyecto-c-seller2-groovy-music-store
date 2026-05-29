import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import SignOutBtn from "@/components/SignOutBtn";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-foreground text-white p-6 flex flex-col gap-6 shrink-0">
        <div>
          <h1 className="font-cormorant text-2xl font-light tracking-[0.2em] uppercase">
            Groovy
          </h1>
          <p className="font-dm text-xs text-white/50 tracking-widest uppercase mt-1">
            Panel del vendedor
          </p>
        </div>

        <nav aria-label="Navegación principal" className="flex flex-col gap-1">
          <Link
            href="/dashboard"
            className="font-dm text-sm text-white/70 hover:text-white hover:bg-white/10 px-3 py-2 rounded transition-colors"
          >
            Inicio
          </Link>
          <Link
            href="/mis-productos"
            className="font-dm text-sm text-white/70 hover:text-white hover:bg-white/10 px-3 py-2 rounded transition-colors"
          >
            Mis productos
          </Link>
          <Link
            href="/mis-ventas"
            className="font-dm text-sm text-white/70 hover:text-white hover:bg-white/10 px-3 py-2 rounded transition-colors"
          >
            Mis ventas
          </Link>
          <Link
            href="/balance"
            className="font-dm text-sm text-white/70 hover:text-white hover:bg-white/10 px-3 py-2 rounded transition-colors"
          >
            Balance
          </Link>
          <div className="mt-auto">
            <SignOutBtn />
          </div>
        </nav>
      </aside>

      <main role="main" className="flex-1 p-8 bg-background">
        {children}
      </main>
    </div>
  );
}