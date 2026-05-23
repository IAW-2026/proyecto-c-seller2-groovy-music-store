import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="bg-card border border-border rounded-2xl p-10 max-w-md w-full text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-primary"></div>
        
        <p className="font-cormorant text-8xl font-light text-primary mb-2">
          404
        </p>
        <h1 className="font-syne text-2xl font-semibold text-foreground mb-3">
          Página no encontrada
        </h1>
        <p className="font-dm text-sm text-medium mb-8">
          La página que buscás no existe o fue removida.
        </p>
        <Link
          href="/dashboard"
          className="font-dm text-sm bg-foreground text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity inline-block"
        >
          Volver al panel
        </Link>
      </div>
    </main>
  );
}