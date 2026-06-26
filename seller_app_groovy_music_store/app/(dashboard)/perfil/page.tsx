import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PerfilForm from "@/components/PerfilForm";

export default async function PerfilPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const perfil = await prisma.perfilVendedor.findUnique({
    where: { clerk_user_id: userId },
  });

  return (
    <div>
      <h1 className="font-cormorant text-4xl font-light mb-1">
        Configuración del perfil
      </h1>
      <p className="font-dm text-sm text-medium mb-8">
        Actualizá los datos de tu negocio
      </p>

      <div className="max-w-lg">
        <PerfilForm
          initialData={{
            nombre: perfil?.nombre ?? "",
            descripcion: perfil?.descripcion ?? "",
            direccion: perfil?.direccion ?? "",
            ciudad: perfil?.ciudad ?? "",
            provincia: perfil?.provincia ?? "",
            codigo_postal: perfil?.codigo_postal ?? "",
          }}
        />
      </div>
    </div>
  );
}