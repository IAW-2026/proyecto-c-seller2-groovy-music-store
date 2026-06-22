"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function DashboardShell({
  sidebar,
  titulo = "Groovy",
  children,
}: {
  sidebar: React.ReactNode;
  titulo?: string;
  children: React.ReactNode;
}) {
  const [esMobile, setEsMobile] = useState(false);
  const [abierto, setAbierto] = useState(false);
  const pathname = usePathname();

  // Detectar mobile sin depender de clases responsive de Tailwind
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const actualizar = () => setEsMobile(mq.matches);
    actualizar();
    mq.addEventListener("change", actualizar);
    return () => mq.removeEventListener("change", actualizar);
  }, []);

  // Cerrar el drawer al navegar
  useEffect(() => {
    setAbierto(false);
  }, [pathname]);

  // ----- DESKTOP: sidebar fijo al costado -----
  if (!esMobile) {
    return (
      <div style={{ display: "flex", minHeight: "100vh" }}>
        <aside
          className="bg-foreground text-white flex flex-col"
          style={{ width: "16rem", flexShrink: 0 }}
        >
          {sidebar}
        </aside>
        <main
          className="bg-background"
          style={{ flex: 1, minWidth: 0, padding: "2rem" }}
        >
          {children}
        </main>
      </div>
    );
  }

  // ----- MOBILE: barra arriba + drawer deslizante -----
  return (
    <div style={{ minHeight: "100vh" }}>
      <header
        className="bg-foreground text-white"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 30,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0.75rem 1rem",
        }}
      >
        <span
          className="font-cormorant"
          style={{ fontSize: "1.25rem", letterSpacing: "0.2em", textTransform: "uppercase" }}
        >
          {titulo}
        </span>
        <button
          type="button"
          onClick={() => setAbierto(true)}
          aria-label="Abrir menú"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "5px",
            padding: "4px",
            background: "transparent",
            border: "none",
            cursor: "pointer",
          }}
        >
          <span style={{ display: "block", width: "24px", height: "2px", backgroundColor: "#fff" }} />
          <span style={{ display: "block", width: "24px", height: "2px", backgroundColor: "#fff" }} />
          <span style={{ display: "block", width: "24px", height: "2px", backgroundColor: "#fff" }} />
        </button>
      </header>

      <main
        className="bg-background"
        style={{ padding: "1rem", minHeight: "calc(100vh - 50px)" }}
      >
        {children}
      </main>

      {abierto && (
        <div
          onClick={() => setAbierto(false)}
          style={{ position: "fixed", inset: 0, zIndex: 40, backgroundColor: "rgba(0,0,0,0.5)" }}
        />
      )}

      <aside
        className="bg-foreground text-white flex flex-col"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          width: "16rem",
          zIndex: 50,
          overflowY: "auto",
          transform: abierto ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s ease",
        }}
      >
        <button
          type="button"
          onClick={() => setAbierto(false)}
          aria-label="Cerrar menú"
          style={{
            position: "absolute",
            top: "0.75rem",
            right: "1rem",
            color: "rgba(255,255,255,0.7)",
            background: "transparent",
            border: "none",
            fontSize: "1.5rem",
            lineHeight: 1,
            cursor: "pointer",
            zIndex: 1,
          }}
        >
          ✕
        </button>
        {sidebar}
      </aside>
    </div>
  );
}