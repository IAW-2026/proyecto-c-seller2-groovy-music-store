export interface Direccion {
  calle?: string;
  ciudad?: string;
  provincia?: string;
  cod_postal?: string;
  pais?: string;
}

interface CrearEnvioInput {
  order_id: string;
  seller_id: string;
  buyer_id: string;
  direccionDestino: Direccion; // del comprador (formato de la Buyer App)
  direccionOrigen: Direccion;  // del vendedor (de nuestra base)
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
    console.log("[Shipping mock] Envío simulado para orden:", input.order_id);
    console.log("[Shipping mock] Destino:", input.direccionDestino);
    console.log("[Shipping mock] Origen:", input.direccionOrigen);
    return {
      envioId: `mock-envio-${Date.now()}`,
      codigoSeguimiento: `TRK-MOCK-${Math.floor(Math.random() * 1000000)}`,
      estado: "EN PREPARACIÓN",
    };
  }

  try {
    const res = await fetch(`${SHIPPING_APP_URL}/api/shipments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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