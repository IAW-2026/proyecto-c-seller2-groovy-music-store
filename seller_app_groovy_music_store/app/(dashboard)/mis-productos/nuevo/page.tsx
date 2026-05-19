import { crearProducto } from "./actions";
import ProductoForm from "@/components/ProductoForm";

export default function NuevoProductoPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Nuevo Producto</h1>
      <ProductoForm action={crearProducto} />
    </div>
  );
}