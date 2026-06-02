import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { esAdmin } from "@/lib/admin";

export default async function Home() {
  const { userId } = await auth();
  if (userId) {
    if (esAdmin(userId)) redirect("/admin");
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <nav className="flex items-center justify-center px-8 py-5 bg-foreground text-white">
        <span className="font-cormorant text-3xl font-light tracking-[0.55em] select-none">
          GROOVY
        </span>
      </nav>

      <div className="flex flex-grow items-center justify-center p-6">
        <div className="bg-card border border-border rounded-2xl p-10 md:p-14 max-w-lg w-full flex flex-col items-center text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-primary"></div>

          <h1 className="font-syne text-3xl md:text-4xl font-bold text-foreground mb-3">
            Panel de Vendedores
          </h1>
          <p className="font-cormorant text-xl text-medium mb-2">
            Groovy Music Store
          </p>
          <p className="font-dm text-sm text-medium mb-10">
            Gestioná tus productos, ventas y balance desde un solo lugar.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <Link
              href="/sign-in"
              className="flex-1 bg-primary text-white rounded-full py-3.5 px-6 text-[13px] font-dm font-semibold tracking-[0.1em] uppercase hover:opacity-90 transition-opacity flex justify-center items-center"
            >
              Iniciar sesión
            </Link>
            <Link
              href="/sign-up"
              className="flex-1 bg-foreground text-white rounded-full py-3.5 px-6 text-[13px] font-dm font-semibold tracking-[0.1em] uppercase hover:opacity-90 transition-opacity flex justify-center items-center"
            >
              Registrarse
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
