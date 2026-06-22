import { requireAdmin } from "@/lib/admin";
import Link from "next/link";
import SignOutBtn from "@/components/SignOutBtn";
import DashboardShell from "@/components/DashboardShell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  const sidebar = (
    <>
      <div className="p-6">
        <h1 className="font-cormorant text-2xl font-light tracking-[0.2em] uppercase">
          Groovy
        </h1>
        <p className="font-dm text-xs text-white/50 tracking-widest uppercase mt-1">
          Panel de administración
        </p>
      </div>

      <nav className="flex flex-col gap-1 px-4 flex-1">
        <Link href="/admin" className="font-dm text-sm text-white/70 hover:text-white hover:bg-white/10 px-3 py-2 rounded transition-colors">
          Overview
        </Link>
        <Link href="/admin/productos" className="font-dm text-sm text-white/70 hover:text-white hover:bg-white/10 px-3 py-2 rounded transition-colors">
          Productos
        </Link>
        <Link href="/admin/vendedores" className="font-dm text-sm text-white/70 hover:text-white hover:bg-white/10 px-3 py-2 rounded transition-colors">
          Vendedores
        </Link>
      </nav>

      <div className="p-4 border-t border-white/10">
        <SignOutBtn />
      </div>
    </>
  );

  return (
    <DashboardShell titulo="Groovy" sidebar={sidebar}>
      {children}
    </DashboardShell>
  );
}