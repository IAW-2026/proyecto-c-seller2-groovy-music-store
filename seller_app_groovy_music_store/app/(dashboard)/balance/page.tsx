import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

// Mock de Payments App — en Etapa 3 esto se reemplaza por una llamada real
async function consultarBalance(sellerId: string) {
  const PAYMENTS_APP_URL = process.env.PAYMENTS_APP_URL;

  if (!PAYMENTS_APP_URL) {
    // Mock para Etapa 2
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
      <h1 className="text-2xl font-bold mb-2">Balance</h1>
      <p className="text-sm text-gray-500 mb-6">
        {!process.env.PAYMENTS_APP_URL && (
          <span className="text-yellow-600">
            ⚠ Datos simulados — Payments App no conectada
          </span>
        )}
      </p>

      <div className="bg-white border rounded p-4 mb-6 inline-block">
        <p className="text-sm text-gray-500">Total acreditado</p>
        <p className="text-3xl font-bold">${total.toLocaleString()}</p>
      </div>

      <div className="grid gap-3">
        {pagos.map((pago: { ordenId: string; monto: number; estado: string }) => (
          <div
            key={pago.ordenId}
            className="border rounded p-4 bg-white flex justify-between items-center"
          >
            <div>
              <p className="font-medium text-sm">Orden: {pago.ordenId}</p>
              <p className="text-lg font-semibold">${pago.monto.toLocaleString()}</p>
            </div>
            <span
              className={`text-xs px-2 py-1 rounded-full font-medium ${
                colorEstado[pago.estado] ?? "bg-gray-100 text-gray-800"
              }`}
            >
              {pago.estado}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}