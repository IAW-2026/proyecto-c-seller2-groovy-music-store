interface DireccionDestino {
  ciudad: string;
  calle?: string;
  provincia?: string;
  cod_postal?: string;
}

interface CrearEnvioInput {
  order_id: string;
  seller_id: string;
  buyer_id: string;
  direccionDestino: DireccionDestino;
}

interface CrearEnvioResponse {
  envioId: string;
  codigoSeguimiento: string;
  estado: string;
}

export async function crearEnvioEnShipping(
  input: CrearEnvioInput
): Promise<CrearEnvioResponse | null> {
  const SHIPPING_APP_URL = process.env.SHIPPING_APP_URL;

  if (!SHIPPING_APP_URL) {
    // Mock mientras no esté conectada la Shipping App
    console.log("[Shipping mock] Envío simulado para orden:", input.order_id);
    return {
      envioId: `mock-envio-${Date.now()}`,
      codigoSeguimiento: `TRK-MOCK-${Math.floor(Math.random() * 1000000)}`,
      estado: "EN PREPARACIÓN",
    };
  }

  try {
    const res = await fetch(`${SHIPPING_APP_URL}/api/shipments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });

    if (!res.ok) {
      console.error("[Shipping] Error al crear envío:", res.status);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error("[Shipping] Error de red:", error);
    return null;
  }
}