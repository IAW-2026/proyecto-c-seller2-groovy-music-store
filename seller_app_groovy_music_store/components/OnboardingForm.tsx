"use client";

import { useActionState } from "react";
import { completarPerfil } from "@/app/onboarding/actions";

type FormState = {
  errors?: {
    nombre?: string[];
    direccion?: string[];
    codigo_postal?: string[];
  };
  message?: string;
};

const initialState: FormState = {};

export default function OnboardingForm() {
  const [state, formAction, isPending] = useActionState(
    completarPerfil,
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
          className="font-dm w-full border border-border rounded-lg px-4 py-2.5 bg-background focus:outline-none focus:border-foreground transition-colors"
          placeholder="Ej: Discos Vintage BA"
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
          rows={3}
          className="font-dm w-full border border-border rounded-lg px-4 py-2.5 bg-background focus:outline-none focus:border-foreground transition-colors resize-none"
          placeholder="Contá algo sobre tu tienda"
        />
      </div>

      <div>
        <label htmlFor="direccion" className="font-dm text-sm font-medium text-foreground block mb-1">
          Dirección <span className="text-primary">*</span>
        </label>
        <input
          id="direccion"
          name="direccion"
          className="font-dm w-full border border-border rounded-lg px-4 py-2.5 bg-background focus:outline-none focus:border-foreground transition-colors"
          placeholder="Ej: Av. Corrientes 1234, CABA"
        />
        {state.errors?.direccion && (
          <p className="font-dm text-sm text-primary mt-1">{state.errors.direccion[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="codigo_postal" className="font-dm text-sm font-medium text-foreground block mb-1">
          Código postal <span className="text-primary">*</span>
        </label>
        <input
          id="codigo_postal"
          name="codigo_postal"
          className="font-dm w-full border border-border rounded-lg px-4 py-2.5 bg-background focus:outline-none focus:border-foreground transition-colors"
          placeholder="Ej: 1043"
        />
        {state.errors?.codigo_postal && (
          <p className="font-dm text-sm text-primary mt-1">{state.errors.codigo_postal[0]}</p>
        )}
      </div>

      {state.message && (
        <p className="font-dm text-sm text-primary">{state.message}</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="font-dm text-sm bg-foreground text-white px-5 py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {isPending ? "Guardando..." : "Comenzar a vender →"}
      </button>
    </form>
  );
}