import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { esAdmin } from "@/lib/admin";
import OnboardingForm from "@/components/OnboardingForm";

export default async function OnboardingPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  if (await esAdmin(userId)) redirect("/admin");

  // Si ya tiene perfil completo, redirigir al dashboard
  const perfil = await prisma.perfilVendedor.findUnique({
    where: { clerk_user_id: userId },
  });

  if (perfil?.nombre && perfil?.direccion && perfil?.codigo_postal) {
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
        <div className="bg-card border border-border rounded-2xl p-10 max-w-lg w-full relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-primary"></div>

          <h1 className="font-cormorant text-4xl font-light mb-2">
            Completá tu perfil
          </h1>
          <p className="font-dm text-sm text-medium mb-8">
            Estos datos son necesarios para gestionar tus envíos y mostrar tu tienda.
          </p>

          <OnboardingForm />
        </div>
      </div>
    </main>
  );
}