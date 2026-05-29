import { requireAdmin } from "@/lib/admin";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-foreground text-white p-6 flex flex-col gap-6 shrink-0">
        <div>
          <h1 className="font-cormorant text-2xl font-light tracking-[0.2em] uppercase">
            Groovy
          </h1>
          <p className="font-dm text-xs text-white/50 tracking-widest uppercase mt-1">
            Panel de administración
          </p>
        </div>

        <nav className="flex flex-col gap-1">
          <Link href="/admin" className="font-dm text-sm text-white/70 hover:text-white hover:bg-white/10 px-3 py-2 rounded transition-colors">
            Overview
          </Link>
          <Link href="/admin/productos" className="font-dm text-sm text-white/70 hover:text-white hover:bg-white/10 px-3 py-2 rounded transition-colors">
            Productos
          </Link>
          <Link href="/admin/vendedores" className="font-dm text-sm text-white/70 hover:text-white hover:bg-white/10 px-3 py-2 rounded transition-colors">
            Vendedores
          </Link>
          <Link href="/dashboard" className="font-dm text-sm text-primary hover:text-white hover:bg-primary/20 px-3 py-2 rounded transition-colors mt-4 border border-primary/30">
            ← Panel vendedor
          </Link>
        </nav>
      </aside>

      <main role="main" className="flex-1 p-8 bg-background">
        {children}
      </main>
    </div>
  );
}