import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

async function consultarBalance(sellerId: string) {
  const PAYMENTS_APP_URL = process.env.PAYMENTS_APP_URL;

  if (!PAYMENTS_APP_URL) {
    return {
      balance_retenido: 83300,
      balance_acreditado: 38300,
    };
  }

  const res = await fetch(
    `${PAYMENTS_APP_URL}/api/payouts?sellerId=${sellerId}`,
    { cache: "no-store" }
  );
  return res.json();
}

export default async function BalancePage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const data = await consultarBalance(userId);
  const balanceRetenido   = data.balance_retenido   ?? 0;
  const balanceAcreditado = data.balance_acreditado ?? 0;

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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-card border border-border rounded-xl p-6">
          <p className="font-dm text-sm text-medium">Total acreditado</p>
          <p className="font-cormorant text-5xl font-light text-foreground mt-1">
            ${balanceAcreditado.toLocaleString()}
          </p>
          <span className="font-dm text-xs px-2.5 py-1 rounded-full font-medium bg-green-100 text-green-800 inline-block mt-3">
            acreditado
          </span>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <p className="font-dm text-sm text-medium">Total retenido</p>
          <p className="font-cormorant text-5xl font-light text-foreground mt-1">
            ${balanceRetenido.toLocaleString()}
          </p>
          <span className="font-dm text-xs px-2.5 py-1 rounded-full font-medium bg-yellow-100 text-yellow-800 inline-block mt-3">
            retenido
          </span>
        </div>
      </div>
    </div>
  );
}