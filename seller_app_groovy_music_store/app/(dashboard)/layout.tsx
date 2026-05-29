import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import SignOutBtn from "@/components/SignOutBtn";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const [perfil, user] = await Promise.all([
    prisma.perfilVendedor.findUnique({
      where: { clerk_user_id: userId },
    }),
    currentUser(),
  ]);

  if (!perfil?.nombre || !perfil?.direccion || !perfil?.codigo_postal) {
    redirect("/onboarding");
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-foreground text-white flex flex-col shrink-0">

        <div className="p-6 border-b border-white/10 flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/20">
            {user?.imageUrl ? (
              <Image
                src={user.imageUrl}
                alt={perfil.nombre ?? "Vendedor"}
                width={64}
                height={64}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full bg-white/10 flex items-center justify-center font-cormorant text-2xl">
                {perfil.nombre?.[0]?.toUpperCase()}
              </div>
            )}
          </div>
          <div className="text-center">
            <p className="font-syne text-sm font-semibold text-white leading-tight">
              {perfil.nombre}
            </p>
            <p className="font-dm text-xs text-white/50 mt-0.5">
              @{user?.firstName?.toLowerCase()}
            </p>
          </div>
        </div>

        <nav aria-label="Navegación principal" className="flex flex-col gap-1 p-4 flex-1">
          <Link href="/dashboard" className="font-dm text-sm text-white/70 hover:text-white hover:bg-white/10 px-3 py-2 rounded transition-colors">
            Inicio
          </Link>
          <Link href="/mis-productos" className="font-dm text-sm text-white/70 hover:text-white hover:bg-white/10 px-3 py-2 rounded transition-colors">
            Mis productos
          </Link>
          <Link href="/mis-ventas" className="font-dm text-sm text-white/70 hover:text-white hover:bg-white/10 px-3 py-2 rounded transition-colors">
            Mis ventas
          </Link>
          <Link href="/balance" className="font-dm text-sm text-white/70 hover:text-white hover:bg-white/10 px-3 py-2 rounded transition-colors">
            Balance
          </Link>
        </nav>

        <div className="p-4 border-t border-white/10 flex flex-col gap-1">
          <Link href="/perfil" className="font-dm text-sm text-white/70 hover:text-white hover:bg-white/10 px-3 py-2 rounded transition-colors">
            ⚙ Configuración
          </Link>
          <SignOutBtn />
        </div>

      </aside>

      <main role="main" className="flex-1 p-8 bg-background min-w-0">
        {children}
      </main>
    </div>
  );
}