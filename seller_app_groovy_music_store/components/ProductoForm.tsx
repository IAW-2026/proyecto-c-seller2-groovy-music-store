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
    <form action={formAction} className="flex flex-col gap-5 max-w-lg">

      <div>
        <label className="font-dm text-sm font-medium text-foreground block mb-1">
          Título
        </label>
        <input
          name="titulo"
          defaultValue={initialData?.titulo}
          className="font-dm w-full border border-border rounded-lg px-4 py-2.5 bg-card focus:outline-none focus:border-foreground transition-colors"
          placeholder="Ej: Abbey Road"
        />
        {state.errors?.titulo && (
          <p className="font-dm text-sm text-primary mt-1">{state.errors.titulo[0]}</p>
        )}
      </div>

      <div>
        <label className="font-dm text-sm font-medium text-foreground block mb-1">
          Artista
        </label>
        <input
          name="artista"
          defaultValue={initialData?.artista}
          className="font-dm w-full border border-border rounded-lg px-4 py-2.5 bg-card focus:outline-none focus:border-foreground transition-colors"
          placeholder="Ej: The Beatles"
        />
        {state.errors?.artista && (
          <p className="font-dm text-sm text-primary mt-1">{state.errors.artista[0]}</p>
        )}
      </div>

      <div>
        <label className="font-dm text-sm font-medium text-foreground block mb-1">
          Descripción
        </label>
        <textarea
          name="descripcion"
          defaultValue={initialData?.descripcion}
          className="font-dm w-full border border-border rounded-lg px-4 py-2.5 bg-card focus:outline-none focus:border-foreground transition-colors resize-none"
          rows={3}
          placeholder="Descripción del producto"
        />
      </div>

      <div>
        <label className="font-dm text-sm font-medium text-foreground block mb-1">
          Género
        </label>
        <input
          name="genero"
          defaultValue={initialData?.genero}
          className="font-dm w-full border border-border rounded-lg px-4 py-2.5 bg-card focus:outline-none focus:border-foreground transition-colors"
          placeholder="Ej: Rock, Jazz, Cumbia"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="font-dm text-sm font-medium text-foreground block mb-1">
            Formato
          </label>
          <select
            name="formato"
            defaultValue={initialData?.formato}
            className="font-dm w-full border border-border rounded-lg px-4 py-2.5 bg-card focus:outline-none focus:border-foreground transition-colors"
          >
            <option value="VINILO">Vinilo</option>
            <option value="CD">CD</option>
            <option value="CASSETTE">Cassette</option>
            <option value="MERCHANDISE">Merchandise</option>
            <option value="OTRO">Otro</option>
          </select>
        </div>

        <div>
          <label className="font-dm text-sm font-medium text-foreground block mb-1">
            Condición
          </label>
          <select
            name="condicion"
            defaultValue={initialData?.condicion}
            className="font-dm w-full border border-border rounded-lg px-4 py-2.5 bg-card focus:outline-none focus:border-foreground transition-colors"
          >
            <option value="NUEVO">Nuevo</option>
            <option value="COMO_NUEVO">Como nuevo</option>
            <option value="BUENO">Bueno</option>
            <option value="ACEPTABLE">Aceptable</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="font-dm text-sm font-medium text-foreground block mb-1">
            Precio
          </label>
          <input
            name="precio"
            type="number"
            step="0.01"
            defaultValue={initialData?.precio}
            className="font-dm w-full border border-border rounded-lg px-4 py-2.5 bg-card focus:outline-none focus:border-foreground transition-colors"
            placeholder="Ej: 5000"
          />
          {state.errors?.precio && (
            <p className="font-dm text-sm text-primary mt-1">{state.errors.precio[0]}</p>
          )}
        </div>

        <div>
          <label className="font-dm text-sm font-medium text-foreground block mb-1">
            Stock
          </label>
          <input
            name="stock"
            type="number"
            defaultValue={initialData?.stock}
            className="font-dm w-full border border-border rounded-lg px-4 py-2.5 bg-card focus:outline-none focus:border-foreground transition-colors"
            placeholder="Ej: 10"
          />
          {state.errors?.stock && (
            <p className="font-dm text-sm text-primary mt-1">{state.errors.stock[0]}</p>
          )}
        </div>
      </div>

      {state.message && (
        <p className="font-dm text-sm text-primary">{state.message}</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="font-dm text-sm bg-foreground text-white px-5 py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {isPending ? "Guardando..." : "Guardar producto"}
      </button>
    </form>
  );
}