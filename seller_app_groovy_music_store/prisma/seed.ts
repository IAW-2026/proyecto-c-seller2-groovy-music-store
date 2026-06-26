import { config } from "dotenv";
config({ path: ".env.local" });
import { PrismaClient } from "../app/generated/prisma";
import fs from "fs";
import {
  SELLER_ID,
  PRODUCTOS,
  BUYERS,
  DIRECCIONES,
  ORDENES,
  ENVIO_IDS,
} from "./contrato-datos";

const prisma = new PrismaClient();

// ─── Descripciones de catálogo (texto de marketing — no es parte del contrato
// compartido entre apps, así que vive acá nomás, no en contrato-datos.ts) ───
const DESCRIPCIONES: Record<string, string> = {
  "Dark Side of the Moon": "Edición original 1973. Excelente estado. Incluye pósters originales.",
  "Kind of Blue": "Reedición de colección 180g. Estado impecable.",
  "Honrar la Vida": "Vinilo en perfecto estado. Edición argentina original.",
  "Thriller": "Vinilo original 1982. Algo de desgaste en la cubierta, disco en buen estado.",
  "Led Zeppelin IV": "Reedición remasterizada. Stairway to Heaven en vinilo, como debe ser.",
  "Rumours": "Edición especial 45 aniversario. 180g. Sin uso.",
  "A Love Supreme": "Prensado original Impulse! Records. Tapa con desgaste leve, disco impecable.",
  "La Grasa de las Capitales": "Edición argentina original 1979. Clásico del rock nacional.",
  "Tapestry": "Vinilo 180g reedición. Uno de los álbumes más vendidos de todos los tiempos.",
  "Obras Completas Vol. 1": "Doble vinilo. Edición especial de colección. Perfecto estado.",
  "Nevermind": "CD edición especial con booklet extendido.",
  "Folklore": "CD sellado. Edición estándar.",
  "OK Computer": "CD remasterizado OKNOTOK 1997-2017. Booklet completo.",
  "Goodbye Yellow Brick Road": "Doble CD remasterizado. 17 temas clásicos.",
  "Unplugged in New York": "CD original 1994. Grabación en vivo acústica. Sin rayaduras.",
  "Café de los Maestros": "CD doble. Grandes maestros del tango argentino. Edición especial.",
  "El Amor Después del Amor": "CD original. El álbum más vendido del rock nacional.",
  "Bat Out of Hell": "Cassette original 1977. Clásico del rock.",
  "Born in the USA": "Cassette original 1984. Funciona perfecto.",
  "Whitney Houston": "Cassette debut 1985. Coleccionable. Estado muy bueno.",
  "Charly García en Vivo": "Cassette en vivo. Rareza del rock nacional. Muy buen estado.",
  "Tango: Zero Hour": "Cassette original American Clavé Records 1986. Coleccionable.",
  "Abbey Road": "Vinilo con tapa dañada. Disco en buen estado.",
  "Back in Black": "CD con estuche roto. Se vende solo el disco.",
};

// ─── Imágenes (opcional): si existe prisma/imagenes-productos.json (lo genera
// el script de subida a Cloudinary que vamos a hacer al final), se usa. Si no
// existe todavía, todos los productos quedan con imagenes: [] y no rompe nada. ───
function cargarImagenes(): Record<string, string[]> {
  const ruta = "prisma/imagenes-productos.json";
  if (!fs.existsSync(ruta)) return {};
  try {
    return JSON.parse(fs.readFileSync(ruta, "utf-8"));
  } catch {
    console.warn("⚠ No se pudo leer imagenes-productos.json, sigo sin imágenes.");
    return {};
  }
}

// estado_global del contrato -> estado_preparacion de Seller.
// Seller no tiene granularidad más allá de ENVIADO: lo que pasa después
// (en camino / entregado) es responsabilidad de Shipping, no de esta app.
const MAPA_PREPARACION: Record<string, string> = {
  PREPARANDO_PENDIENTE: "PENDIENTE",
  PREPARANDO: "PREPARANDO",
  LISTO_PARA_ENVIO: "LISTO_PARA_ENVIO",
  ENVIADO_EN_PREPARACION: "ENVIADO",
  EN_CAMINO: "ENVIADO",
  ENTREGADO: "ENVIADO",
};

async function main() {
  console.log("🌱 Iniciando seed...");

  await prisma.itemReserva.deleteMany();
  await prisma.reserva.deleteMany();
  await prisma.itemVenta.deleteMany();
  await prisma.venta.deleteMany();
  await prisma.producto.deleteMany();
  await prisma.perfilVendedor.deleteMany();

  console.log("✓ Tablas limpiadas");

  const vendedor = await prisma.perfilVendedor.create({
    data: {
      clerk_user_id: SELLER_ID,
      nombre: "Groovy Records",
      descripcion: "Disquería especializada en vinilos, CDs y cassettes. Rock, jazz, folklore y más.",
      direccion: "Av. Corrientes 1234",
      ciudad: "Buenos Aires",
      provincia: "Buenos Aires",
      codigo_postal: "1043",
    },
  });
  console.log("✓ Perfil vendedor creado:", vendedor.nombre);

  const imagenesPorTitulo = cargarImagenes();
  if (Object.keys(imagenesPorTitulo).length === 0) {
    console.log("ℹ Sin imagenes-productos.json todavía — productos sin fotos por ahora.");
  }

  const productos = await Promise.all(
    PRODUCTOS.map((p) =>
      prisma.producto.create({
        data: {
          id: p.id,
          seller_id: SELLER_ID,
          titulo: p.titulo,
          artista: p.artista,
          descripcion: DESCRIPCIONES[p.titulo] ?? "",
          genero: p.genero,
          formato: p.formato as "VINILO" | "CD" | "CASSETTE" | "MERCHANDISE" | "OTRO",
          condicion: p.condicion as "NUEVO" | "COMO_NUEVO" | "BUENO" | "ACEPTABLE",
          precio: p.precio,
          stock: p.stock,
          imagenes: imagenesPorTitulo[p.titulo] ?? [],
          activo: p.activo,
        },
      })
    )
  );

  const activos = PRODUCTOS.filter((p) => p.activo).length;
  console.log(`✓ ${productos.length} productos creados (${PRODUCTOS.length - activos} desactivados)`);

  // ─── Reservas + Ventas, a partir del libro de órdenes del contrato ───────
  let creadasReserva = 0;
  let creadasVenta = 0;

  for (const orden of ORDENES) {
    const fecha = new Date(Date.now() - orden.dias_atras * 86_400_000);

    const estadoReserva =
      orden.estado_global === "RESERVADO" ? "ACTIVA"
      : orden.estado_global === "PAGO_FALLIDO" ? "LIBERADA"
      : "CONFIRMADA";

    await prisma.reserva.create({
      data: {
        order_id_externo: orden.id,
        buyer_id_externo: orden.buyer_id,
        seller_id: SELLER_ID,
        estado: estadoReserva as "ACTIVA" | "CONFIRMADA" | "LIBERADA",
        created_at: fecha,
        items: {
          create: orden.items.map((it) => ({
            product_id: it.product_id,
            cantidad: it.cantidad,
            precio_unit: it.precio_unit,
          })),
        },
      },
    });
    creadasReserva++;

    const estadoPreparacion = MAPA_PREPARACION[orden.estado_global];
    if (estadoPreparacion) {
      await prisma.venta.create({
        data: {
          order_id_externo: orden.id,
          buyer_id_externo: orden.buyer_id,
          seller_id: SELLER_ID,
          estado_preparacion: estadoPreparacion as
            | "PENDIENTE" | "PREPARANDO" | "LISTO_PARA_ENVIO" | "ENVIADO",
          envio_id_externo: ENVIO_IDS[orden.id] ?? null,
          direccion_envio: DIRECCIONES[orden.buyer_id] ?? undefined,
          created_at: fecha,
          items: {
            create: orden.items.map((it) => ({
              product_id: it.product_id,
              cantidad: it.cantidad,
              precio_unit: it.precio_unit,
            })),
          },
        },
      });
      creadasVenta++;
    }
  }

  console.log(`✓ ${creadasReserva} reservas creadas (${creadasVenta} confirmadas como venta)`);

  // ─── Resumen final ────────────────────────────────────────────────────────
  const [porEstadoPrep, totalIngresos] = await Promise.all([
    prisma.venta.groupBy({ by: ["estado_preparacion"], _count: { _all: true } }),
    prisma.itemVenta.findMany({ select: { precio_unit: true, cantidad: true } }),
  ]);

  const ingresos = totalIngresos.reduce(
    (acc, i) => acc + Number(i.precio_unit) * i.cantidad,
    0
  );

  console.log("");
  console.log("📊 Resumen del seed:");
  console.log(`   Vendedor:          Groovy Records (${SELLER_ID})`);
  console.log(`   Compradores:       ${BUYERS.length} (1 real + ${BUYERS.length - 1} de fondo)`);
  console.log(`   Productos totales: ${productos.length} (${activos} activos, ${productos.length - activos} desactivados)`);
  console.log(`   Reservas:          ${creadasReserva}`);
  console.log(`   Ventas:            ${creadasVenta}`);
  for (const grupo of porEstadoPrep) {
    console.log(`     - ${grupo.estado_preparacion}: ${grupo._count._all}`);
  }
  console.log(`   Ingresos (ventas): $${ingresos.toLocaleString("es-AR")}`);
  console.log("");
  console.log("✅ Seed completado. Credenciales de acceso:");
  console.log("   /dashboard  → seller+clerktest@iaw.com      (contraseña: iawuser#)");
  console.log("   /admin      → admin_seller+clerktest@iaw.com (contraseña: iawuser#)");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });