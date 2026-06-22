import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductoForm from "@/components/ProductoForm";
import { editarProducto, desactivarProducto } from "./actions";

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
      <form action={desactivarConId} className="mt-6">
        <button
          type="submit"
          className="text-red-500 border border-red-500 px-4 py-2 rounded hover:bg-red-50"
        >
          Eliminar producto
        </button>
      </form>
    </div>
  );
}