"use client";

import { useActionState } from "react";
import { actualizarPerfil } from "@/app/(dashboard)/perfil/actions";

type FormState = {
  errors?: {
    nombre?: string[];
    direccion?: string[];
    ciudad?: string[];
    codigo_postal?: string[];
  };
  message?: string;
  success?: boolean;
};

type Props = {
  initialData: {
    nombre: string;
    descripcion: string;
    direccion: string;
    ciudad: string;
    provincia: string;
    codigo_postal: string;
  };
};

const initialState: FormState = {};

export default function PerfilForm({ initialData }: Props) {
  const [state, formAction, isPending] = useActionState(
    actualizarPerfil,
    initialState
  );

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div>
        <label htmlFor="nombre" className="font-dm text-sm font-medium text-foreground block mb-1">
          Nombre del negocio <span className="text-primary">*</span>
        </label>
        <input
          id="nombre"
          name="nombre"
          defaultValue={initialData.nombre}
          className="font-dm w-full border border-border rounded-lg px-4 py-2.5 bg-card focus:outline-none focus:border-foreground transition-colors"
        />
        {state.errors?.nombre && (
          <p className="font-dm text-sm text-primary mt-1">{state.errors.nombre[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="descripcion" className="font-dm text-sm font-medium text-foreground block mb-1">
          Descripción <span className="text-medium text-xs">(opcional)</span>
        </label>
        <textarea
          id="descripcion"
          name="descripcion"
          defaultValue={initialData.descripcion}
          rows={3}
          className="font-dm w-full border border-border rounded-lg px-4 py-2.5 bg-card focus:outline-none focus:border-foreground transition-colors resize-none"
        />
      </div>

      <div>
        <label htmlFor="direccion" className="font-dm text-sm font-medium text-foreground block mb-1">
          Dirección <span className="text-primary">*</span>
        </label>
        <input
          id="direccion"
          name="direccion"
          defaultValue={initialData.direccion}
          className="font-dm w-full border border-border rounded-lg px-4 py-2.5 bg-card focus:outline-none focus:border-foreground transition-colors"
        />
        {state.errors?.direccion && (
          <p className="font-dm text-sm text-primary mt-1">{state.errors.direccion[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="ciudad" className="font-dm text-sm font-medium text-foreground block mb-1">
          Ciudad <span className="text-primary">*</span>
        </label>
        <input
          id="ciudad"
          name="ciudad"
          defaultValue={initialData.ciudad}
          className="font-dm w-full border border-border rounded-lg px-4 py-2.5 bg-card focus:outline-none focus:border-foreground transition-colors"
        />
        {state.errors?.ciudad && (
          <p className="font-dm text-sm text-primary mt-1">{state.errors.ciudad[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="provincia" className="font-dm text-sm font-medium text-foreground block mb-1">
          Provincia <span className="text-medium text-xs">(opcional)</span>
        </label>
        <input
          id="provincia"
          name="provincia"
          defaultValue={initialData.provincia}
          className="font-dm w-full border border-border rounded-lg px-4 py-2.5 bg-card focus:outline-none focus:border-foreground transition-colors"
        />
      </div>

      <div>
        <label htmlFor="codigo_postal" className="font-dm text-sm font-medium text-foreground block mb-1">
          Código postal <span className="text-primary">*</span>
        </label>
        <input
          id="codigo_postal"
          name="codigo_postal"
          defaultValue={initialData.codigo_postal}
          className="font-dm w-full border border-border rounded-lg px-4 py-2.5 bg-card focus:outline-none focus:border-foreground transition-colors"
        />
        {state.errors?.codigo_postal && (
          <p className="font-dm text-sm text-primary mt-1">{state.errors.codigo_postal[0]}</p>
        )}
      </div>

      {state.message && (
        <p className={`font-dm text-sm ${state.success ? "text-green-600" : "text-primary"}`}>
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="font-dm text-sm bg-foreground text-white px-5 py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {isPending ? "Guardando..." : "Guardar cambios"}
      </button>
    </form>
  );
}