import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductoForm from "@/components/ProductoForm";
import { editarProducto, desactivarProducto } from "./actions";
import BotonConfirmacion from "@/components/BotonConfirmacion";

export default async function EditarProductoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { id } = await params;

  const producto = await prisma.producto.findUnique({
    where: { id, seller_id: userId },
  });

  if (!producto) redirect("/mis-productos");

  const editarConId = editarProducto.bind(null, id);
  const desactivarConId = desactivarProducto.bind(null, id);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Editar Producto</h1>
      <ProductoForm
        action={editarConId}
        initialData={{
          titulo: producto.titulo,
          descripcion: producto.descripcion || "",
          artista: producto.artista,
          genero: producto.genero,
          formato: producto.formato,
          condicion: producto.condicion,
          precio: producto.precio.toString(),
          stock: producto.stock.toString(),
          imagenes: producto.imagenes,
        }}
      />
      <div className="mt-6">
        <BotonConfirmacion
          action={desactivarConId}
          label="Eliminar producto"
          titulo="Eliminar producto"
          mensaje={`¿Seguro que querés eliminar "${producto.titulo}"? Dejará de aparecer en la tienda.`}
          confirmLabel="Eliminar"
          variant="danger"
        />
      </div>
    </div>
  );
}