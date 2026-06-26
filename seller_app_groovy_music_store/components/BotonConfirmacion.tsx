"use client";

import { useState } from "react";
import { createPortal } from "react-dom";

type Variant = "danger" | "primary" | "success";

const colores: Record<Variant, string> = {
  danger: "#dc2626",   // rojo
  primary: "#E4572E",  // terracota (tu --accent-terracotta)
  success: "#16a34a",  // verde
};

export default function BotonConfirmacion({
  action,
  label,
  titulo,
  mensaje,
  confirmLabel = "Confirmar",
  variant = "primary",
}: {
  action: (formData: FormData) => void | Promise<void>;
  label: string;
  titulo: string;
  mensaje: string;
  confirmLabel?: string;
  variant?: Variant;
}) {
  const [abierto, setAbierto] = useState(false);
  const color = colores[variant];

  const modal = (
    <div
      onClick={() => setAbierto(false)}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        backgroundColor: "rgba(0,0,0,0.55)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "var(--panel-bg, #FAF8F5)",
          border: "1px solid var(--divider, #DCDCDC)",
          borderRadius: "0.75rem",
          padding: "1.5rem",
          maxWidth: "26rem",
          width: "100%",
          boxShadow: "0 20px 50px rgba(0,0,0,0.35)",
        }}
      >
        <h2
          className="font-syne"
          style={{ fontWeight: 600, fontSize: "1.125rem", color: "var(--text-dark, #2E2E2E)" }}
        >
          {titulo}
        </h2>
        <p
          className="font-dm"
          style={{ fontSize: "0.875rem", color: "var(--text-medium, #6D4C41)", marginTop: "0.5rem" }}
        >
          {mensaje}
        </p>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1.5rem" }}>
          <button
            type="button"
            onClick={() => setAbierto(false)}
            className="font-dm"
            style={{
              fontSize: "0.875rem",
              color: "var(--text-medium, #6D4C41)",
              backgroundColor: "transparent",
              border: "1px solid var(--divider, #DCDCDC)",
              padding: "0.5rem 1rem",
              borderRadius: "0.5rem",
              cursor: "pointer",
            }}
          >
            Cancelar
          </button>
          <form action={action}>
            <button
              type="submit"
              className="font-dm"
              style={{
                fontSize: "0.875rem",
                color: "#ffffff",
                backgroundColor: color,
                border: "none",
                padding: "0.5rem 1rem",
                borderRadius: "0.5rem",
                cursor: "pointer",
              }}
            >
              {confirmLabel}
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setAbierto(true)}
        className="font-dm"
        style={{
          fontSize: "0.875rem",
          color: color,
          backgroundColor: "transparent",
          border: `1px solid ${color}`,
          padding: "0.375rem 1rem",
          borderRadius: "0.5rem",
          cursor: "pointer",
        }}
      >
        {label}
      </button>
      {abierto && createPortal(modal, document.body)}
    </>
  );
}