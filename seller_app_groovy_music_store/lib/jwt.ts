import { SignJWT, jwtVerify } from "jose";

// Verifica el JWT entrante: quien nos llama lo firmó con NUESTRO secret (SELLER_JWT_SECRET)
export async function verificarJWTEntrante(request: Request): Promise<boolean> {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) return false;

  const secret = process.env.SELLER_JWT_SECRET;
  if (!secret) {
    console.error("[JWT] Falta SELLER_JWT_SECRET");
    return false;
  }

  try {
    const token = authHeader.split(" ")[1];
    await jwtVerify(token, new TextEncoder().encode(secret));
    return true;
  } catch {
    return false;
  }
}

// Firma un JWT para llamar a otra app: usa el secret de ESA app
export async function firmarTokenPara(
  secret: string | undefined
): Promise<string | null> {
  if (!secret) return null;
  try {
    return await new SignJWT({ servicio: "seller" })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("5m")
      .sign(new TextEncoder().encode(secret));
  } catch (error) {
    console.error("[JWT] Error al firmar token:", error);
    return null;
  }
}