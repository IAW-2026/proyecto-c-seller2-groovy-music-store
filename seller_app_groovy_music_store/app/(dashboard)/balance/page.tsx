import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { firmarTokenPara } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import Paginacion from "@/components/Paginacion";

const LIMITE = 8;

async function consultarBalance(sellerId: string) {
  const PAYMENTS_APP_URL = process.env.PAYMENTS_APP_URL;

  if (!PAYMENTS_APP_URL) {
    return {
      balance_retenido: 83300,
      balance_acreditado: 38300,
    };
  }

  const token = await firmarTokenPara(process.env.PAYMENTS_JWT_SECRET);

  const res = await fetch(
    `${PAYMENTS_APP_URL}/api/payouts?sellerId=${sellerId}`,
    {
      cache: "no-store",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }
  );
  return res.json();
}

// Solo guarda un registro nuevo si el balance cambió desde la última
// consulta. Si entrás dos veces y nada cambió, no se duplica nada.
async function registrarSiCambio(
  sellerId: string,
  retenido: number,
  acreditado: number
) {
  const ultimo = await prisma.registroBalance.findFirst({
    where: { seller_id: sellerId },
    orderBy: { created_at: "desc" },
  });

  const cambio =
    !ultimo ||
    Number(ultimo.balance_retenido) !== retenido ||
    Number(ultimo.balance_acreditado) !== acreditado;

  if (cambio) {
    await prisma.registroBalance.create({
      data: {
        seller_id: sellerId,
        balance_retenido: retenido,
        balance_acreditado: acreditado,
      },
    });
  }
}

export default async function BalancePage({
  searchParams,
}: {
  searchParams: Promise<{ pagina?: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const data = await consultarBalance(userId);
  const balanceRetenido = data.balance_retenido ?? 0;
  const balanceAcreditado = data.balance_acreditado ?? 0;

  await registrarSiCambio(userId, balanceRetenido, balanceAcreditado);

  const { pagina: paginaParam } = await searchParams;
  const pagina = Number(paginaParam) || 1;
  const where = { seller_id: userId };

  const [historial, total] = await Promise.all([
    prisma.registroBalance.findMany({
      where,
      orderBy: { created_at: "desc" },
      skip: (pagina - 1) * LIMITE,
      take: LIMITE,
    }),
    prisma.registroBalance.count({ where }),
  ]);

  const totalPaginas = Math.ceil(total / LIMITE);

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

      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }} className="mb-10">
        <div className="bg-card border border-border rounded-xl p-6" style={{ flex: "1 1 240px" }}>
          <p className="font-dm text-sm text-medium">Total acreditado</p>
          <p className="font-cormorant text-5xl font-light text-foreground mt-1">
            ${balanceAcreditado.toLocaleString()}
          </p>
          <span className="font-dm text-xs px-2.5 py-1 rounded-full font-medium bg-green-100 text-green-800 inline-block mt-3">
            acreditado
          </span>
        </div>

        <div className="bg-card border border-border rounded-xl p-6" style={{ flex: "1 1 240px" }}>
          <p className="font-dm text-sm text-medium">Total retenido</p>
          <p className="font-cormorant text-5xl font-light text-foreground mt-1">
            ${balanceRetenido.toLocaleString()}
          </p>
          <span className="font-dm text-xs px-2.5 py-1 rounded-full font-medium bg-yellow-100 text-yellow-800 inline-block mt-3">
            retenido
          </span>
        </div>
      </div>

      <div>
        <h2 className="font-syne text-lg font-semibold text-foreground mb-1">
          Historial de balance
        </h2>
        <p className="font-dm text-sm text-medium mb-4">
          Cada fila es un cambio real respecto a la consulta anterior. Si el
          balance no cambió desde tu última visita, no se agrega nada nuevo.
        </p>

        {total === 0 ? (
          <div className="bg-card border border-border rounded-xl p-8 text-center">
            <p className="font-dm text-sm text-medium">
              Todavía no hay registros de cambios en el balance.
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-2">
              {historial.map((registro, i) => {
                const masViejo = historial[i + 1];
                const delta = masViejo
                  ? Number(registro.balance_acreditado) - Number(masViejo.balance_acreditado)
                  : null;

                return (
                  <div
                    key={registro.id}
                    className="bg-card border border-border rounded-xl p-4 flex items-center justify-between gap-4"
                  >
                    <div>
                      <p className="font-dm text-xs text-medium">
                        {registro.created_at.toLocaleString("es-AR", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </p>
                      <p className="font-dm text-sm text-foreground mt-1">
                        Acreditado: ${Number(registro.balance_acreditado).toLocaleString()} ·{" "}
                        Retenido: ${Number(registro.balance_retenido).toLocaleString()}
                      </p>
                    </div>
                    {delta !== null && delta !== 0 && (
                      <span
                        className="font-dm text-xs px-2.5 py-1 rounded-full font-medium whitespace-nowrap"
                        style={{
                          backgroundColor: delta > 0 ? "#dcfce7" : "#fee2e2",
                          color: delta > 0 ? "#166534" : "#991b1b",
                        }}
                      >
                        {delta > 0 ? "+" : ""}${delta.toLocaleString()} acreditado
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            <Paginacion paginaActual={pagina} totalPaginas={totalPaginas} />
          </>
        )}
      </div>
    </div>
  );
}