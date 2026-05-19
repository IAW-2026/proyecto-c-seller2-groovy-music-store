"use client";

import { useActionState } from "react";

type FormState = {
  errors?: {
    titulo?: string[];
    artista?: string[];
    precio?: string[];
    stock?: string[];
  };
  message?: string;
};

type Props = {
  action: (prevState: FormState, formData: FormData) => Promise<FormState>;
  initialData?: {
    titulo: string;
    descripcion: string;
    artista: string;
    genero: string;
    formato: string;
    condicion: string;
    precio: string;
    stock: string;
  };
};

const initialState: FormState = {};

export default function ProductoForm({ action, initialData }: Props) {
  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4 max-w-lg">
      <div>
        <label className="block text-sm font-medium mb-1">Título</label>
        <input
          name="titulo"
          defaultValue={initialData?.titulo}
          className="w-full border rounded px-3 py-2"
          placeholder="Ej: Abbey Road"
        />
        {state.errors?.titulo && (
          <p className="text-red-500 text-sm">{state.errors.titulo[0]}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Artista</label>
        <input
          name="artista"
          defaultValue={initialData?.artista}
          className="w-full border rounded px-3 py-2"
          placeholder="Ej: The Beatles"
        />
        {state.errors?.artista && (
          <p className="text-red-500 text-sm">{state.errors.artista[0]}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Descripción</label>
        <textarea
          name="descripcion"
          defaultValue={initialData?.descripcion}
          className="w-full border rounded px-3 py-2"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Género</label>
        <input
          name="genero"
          defaultValue={initialData?.genero}
          className="w-full border rounded px-3 py-2"
          placeholder="Ej: Rock, Jazz, Cumbia"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Formato</label>
        <select
          name="formato"
          defaultValue={initialData?.formato}
          className="w-full border rounded px-3 py-2"
        >
          <option value="VINILO">Vinilo</option>
          <option value="CD">CD</option>
          <option value="CASSETTE">Cassette</option>
          <option value="MERCHANDISE">Merchandise</option>
          <option value="OTRO">Otro</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Condición</label>
        <select
          name="condicion"
          defaultValue={initialData?.condicion}
          className="w-full border rounded px-3 py-2"
        >
          <option value="NUEVO">Nuevo</option>
          <option value="COMO_NUEVO">Como nuevo</option>
          <option value="BUENO">Bueno</option>
          <option value="ACEPTABLE">Aceptable</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Precio</label>
        <input
          name="precio"
          type="number"
          step="0.01"
          defaultValue={initialData?.precio}
          className="w-full border rounded px-3 py-2"
          placeholder="Ej: 5000"
        />
        {state.errors?.precio && (
          <p className="text-red-500 text-sm">{state.errors.precio[0]}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Stock</label>
        <input
          name="stock"
          type="number"
          defaultValue={initialData?.stock}
          className="w-full border rounded px-3 py-2"
          placeholder="Ej: 10"
        />
        {state.errors?.stock && (
          <p className="text-red-500 text-sm">{state.errors.stock[0]}</p>
        )}
      </div>

      {state.message && (
        <p className="text-red-500 text-sm">{state.message}</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 disabled:opacity-50"
      >
        {isPending ? "Guardando..." : "Guardar producto"}
      </button>
    </form>
  );
}