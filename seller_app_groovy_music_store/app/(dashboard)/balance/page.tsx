import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

async function consultarBalance(sellerId: string) {
  const PAYMENTS_APP_URL = process.env.PAYMENTS_APP_URL;

  if (!PAYMENTS_APP_URL) {
    return {
      datos: [
        { ordenId: "order-mock-001", monto: 45000, estado: "retenido" },
        { ordenId: "order-mock-002", monto: 22800, estado: "acreditado" },
        { ordenId: "order-mock-003", monto: 15500, estado: "acreditado" },
      ],
    };
  }

  const res = await fetch(
    `${PAYMENTS_APP_URL}/api/payouts?sellerId=${sellerId}`,
    { cache: "no-store" }
  );
  return res.json();
}

const colorEstado: Record<string, string> = {
  retenido: "bg-yellow-100 text-yellow-800",
  acreditado: "bg-green-100 text-green-800",
};

export default async function BalancePage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const data = await consultarBalance(userId);
  const pagos = data.datos ?? [];

  const total = pagos.reduce(
    (acc: number, p: { monto: number; estado: string }) =>
      p.estado === "acreditado" ? acc + p.monto : acc,
    0
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-cormorant text-4xl font-light">Balance</h1>
        {!process.env.PAYMENTS_APP_URL && (
          <p className="font-dm text-xs text-yellow-700 bg-yellow-50 border border-yellow-200 px-3 py-1.5 rounded-lg inline-block mt-2">
            ⚠ Datos simulados — Payments App no conectada
          </p>
        )}
      </div>

      <div className="bg-card border border-border rounded-xl p-6 inline-block mb-8">
        <p className="font-dm text-sm text-medium">Total acreditado</p>
        <p className="font-cormorant text-5xl font-light text-foreground mt-1">
          ${total.toLocaleString()}
        </p>
      </div>

      <div className="grid gap-3">
        {pagos.map((pago: { ordenId: string; monto: number; estado: string }) => (
          <div
            key={pago.ordenId}
            className="bg-card border border-border rounded-xl p-5 flex justify-between items-center"
          >
            <div>
              <p className="font-dm text-sm text-medium">Orden: {pago.ordenId}</p>
              <p className="font-syne text-xl font-semibold text-foreground mt-0.5">
                ${pago.monto.toLocaleString()}
              </p>
            </div>
            <span className={`font-dm text-xs px-2.5 py-1 rounded-full font-medium ${colorEstado[pago.estado] ?? "bg-gray-100 text-gray-800"}`}>
              {pago.estado}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}