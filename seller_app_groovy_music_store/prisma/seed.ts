import { config } from "dotenv";
config({ path: ".env.local" });
import { PrismaClient } from "../app/generated/prisma";

const prisma = new PrismaClient();

// ─── IDs reales de Clerk ───────────────────────────────────────────────────
// seller_groovy@... → accede a /dashboard (panel vendedor)
const SELLER_ID = "user_3EVQ5PWnZn5weuLLjjJ0cbHllhJ";

// admin_seller_groovy@... → accede a /admin (panel administrador)
// No tiene PerfilVendedor — el admin no es un vendedor.
// Su acceso está controlado por ADMIN_USER_IDS en .env.local.
const ADMIN_ID = "user_3EVQ9QO7kLfw3BsJfcJZJjHbpn7";

// ─── Buyer IDs mockeados (externos, solo para poblar ventas) ───────────────
const BUYER_A = "user_mock_buyer_001";
const BUYER_B = "user_mock_buyer_002";
const BUYER_C = "user_mock_buyer_003";

async function main() {
  console.log("🌱 Iniciando seed...");

  // ── Limpiar en orden por dependencias de FK ──────────────────────────────
  await prisma.itemReserva.deleteMany();
  await prisma.reserva.deleteMany();
  await prisma.venta.deleteMany();
  await prisma.producto.deleteMany();
  await prisma.perfilVendedor.deleteMany();

  console.log("✓ Tablas limpiadas");

  // ── Perfil del vendedor (seller_groovy) ──────────────────────────────────
  // El admin NO tiene PerfilVendedor — no necesita uno para acceder a /admin.
  const vendedor = await prisma.perfilVendedor.create({
    data: {
      clerk_user_id: SELLER_ID,
      nombre: "Groovy Records",
      descripcion: "Disquería especializada en vinilos, CDs y cassettes. Rock, jazz, folklore y más.",
      direccion: "Av. Corrientes 1234",
      codigo_postal: "1043",
    },
  });

  console.log("✓ Perfil vendedor creado:", vendedor.nombre);

  // ── Productos del vendedor ───────────────────────────────────────────────

  const productos = await Promise.all([
    // Vinilos
    prisma.producto.create({
      data: {
        seller_id: SELLER_ID,
        titulo: "Dark Side of the Moon",
        artista: "Pink Floyd",
        descripcion: "Edición original 1973. Excelente estado. Incluye pósters originales.",
        genero: "Rock",
        formato: "VINILO",
        condicion: "COMO_NUEVO",
        precio: 8500,
        stock: 2,
        imagenes: [],
        activo: true,
      },
    }),
    prisma.producto.create({
      data: {
        seller_id: SELLER_ID,
        titulo: "Kind of Blue",
        artista: "Miles Davis",
        descripcion: "Reedición de colección 180g. Estado impecable.",
        genero: "Jazz",
        formato: "VINILO",
        condicion: "NUEVO",
        precio: 6200,
        stock: 3,
        imagenes: [],
        activo: true,
      },
    }),
    prisma.producto.create({
      data: {
        seller_id: SELLER_ID,
        titulo: "Honrar la vida",
        artista: "Mercedes Sosa",
        descripcion: "Vinilo en perfecto estado. Edición argentina original.",
        genero: "Folklore",
        formato: "VINILO",
        condicion: "BUENO",
        precio: 3500,
        stock: 1,
        imagenes: [],
        activo: true,
      },
    }),
    prisma.producto.create({
      data: {
        seller_id: SELLER_ID,
        titulo: "Thriller",
        artista: "Michael Jackson",
        descripcion: "Vinilo original 1982. Algo de desgaste en la cubierta, disco en buen estado.",
        genero: "Pop",
        formato: "VINILO",
        condicion: "BUENO",
        precio: 4800,
        stock: 1,
        imagenes: [],
        activo: true,
      },
    }),

    // CDs
    prisma.producto.create({
      data: {
        seller_id: SELLER_ID,
        titulo: "Nevermind",
        artista: "Nirvana",
        descripcion: "CD edición especial con booklet extendido.",
        genero: "Rock",
        formato: "CD",
        condicion: "BUENO",
        precio: 1800,
        stock: 5,
        imagenes: [],
        activo: true,
      },
    }),
    prisma.producto.create({
      data: {
        seller_id: SELLER_ID,
        titulo: "La Grasa de las Capitales",
        artista: "Serú Girán",
        descripcion: "CD remasterizado 2001. Sin rayaduras.",
        genero: "Rock Nacional",
        formato: "CD",
        condicion: "NUEVO",
        precio: 2800,
        stock: 4,
        imagenes: [],
        activo: true,
      },
    }),
    prisma.producto.create({
      data: {
        seller_id: SELLER_ID,
        titulo: "Folklore",
        artista: "Taylor Swift",
        descripcion: "CD sellado. Edición estándar.",
        genero: "Pop",
        formato: "CD",
        condicion: "NUEVO",
        precio: 3200,
        stock: 2,
        imagenes: [],
        activo: true,
      },
    }),

    // Cassettes
    prisma.producto.create({
      data: {
        seller_id: SELLER_ID,
        titulo: "Obras Cumbres",
        artista: "Astor Piazzolla",
        descripcion: "Doble cassette. Rareza de colección. Funciona perfecto.",
        genero: "Tango",
        formato: "CASSETTE",
        condicion: "ACEPTABLE",
        precio: 2200,
        stock: 1,
        imagenes: [],
        activo: true,
      },
    }),
    prisma.producto.create({
      data: {
        seller_id: SELLER_ID,
        titulo: "Bat Out of Hell",
        artista: "Meat Loaf",
        descripcion: "Cassette original 1977. Clásico del rock.",
        genero: "Rock",
        formato: "CASSETTE",
        condicion: "BUENO",
        precio: 1500,
        stock: 2,
        imagenes: [],
        activo: true,
      },
    }),

    // Producto desactivado (para mostrar en panel admin)
    prisma.producto.create({
      data: {
        seller_id: SELLER_ID,
        titulo: "Abbey Road",
        artista: "The Beatles",
        descripcion: "Vinilo con tapa dañada. Disco en buen estado.",
        genero: "Rock",
        formato: "VINILO",
        condicion: "ACEPTABLE",
        precio: 5000,
        stock: 0,
        imagenes: [],
        activo: false, // desactivado — aparece en /admin/productos pero no en catálogo
      },
    }),
  ]);

  console.log(`✓ ${productos.length} productos creados (1 desactivado)`);

  // Referencias por nombre para las ventas
  const [
    darkSide, kindOfBlue, honrarLaVida, thriller,
    nevermind, grasaCapitales, folkloreTSwift,
    obrasCumbres, batOutOfHell,
    // abbeyRoad — desactivado, sin ventas
  ] = productos;

  // ── Ventas en todos los estados posibles ────────────────────────────────
  // Distribuidas para que el dashboard muestre números interesantes:
  // totalVentas, pendientes, en preparación, listos para envío, enviados

  await Promise.all([
    // PENDIENTE (recién confirmadas, sin preparar)
    prisma.venta.create({
      data: {
        product_id: darkSide.id,
        order_id_externo: "order-demo-001",
        buyer_id_externo: BUYER_A,
        cantidad: 1,
        precio_unitario: darkSide.precio,
        estado_preparacion: "PENDIENTE",
      },
    }),
    prisma.venta.create({
      data: {
        product_id: nevermind.id,
        order_id_externo: "order-demo-002",
        buyer_id_externo: BUYER_B,
        cantidad: 2,
        precio_unitario: nevermind.precio,
        estado_preparacion: "PENDIENTE",
      },
    }),
    prisma.venta.create({
      data: {
        product_id: folkloreTSwift.id,
        order_id_externo: "order-demo-003",
        buyer_id_externo: BUYER_C,
        cantidad: 1,
        precio_unitario: folkloreTSwift.precio,
        estado_preparacion: "PENDIENTE",
      },
    }),

    // PREPARANDO
    prisma.venta.create({
      data: {
        product_id: kindOfBlue.id,
        order_id_externo: "order-demo-004",
        buyer_id_externo: BUYER_A,
        cantidad: 1,
        precio_unitario: kindOfBlue.precio,
        estado_preparacion: "PREPARANDO",
      },
    }),
    prisma.venta.create({
      data: {
        product_id: thriller.id,
        order_id_externo: "order-demo-005",
        buyer_id_externo: BUYER_B,
        cantidad: 1,
        precio_unitario: thriller.precio,
        estado_preparacion: "PREPARANDO",
      },
    }),

    // LISTO_PARA_ENVIO
    prisma.venta.create({
      data: {
        product_id: grasaCapitales.id,
        order_id_externo: "order-demo-006",
        buyer_id_externo: BUYER_C,
        cantidad: 1,
        precio_unitario: grasaCapitales.precio,
        estado_preparacion: "LISTO_PARA_ENVIO",
      },
    }),
    prisma.venta.create({
      data: {
        product_id: obrasCumbres.id,
        order_id_externo: "order-demo-007",
        buyer_id_externo: BUYER_A,
        cantidad: 1,
        precio_unitario: obrasCumbres.precio,
        estado_preparacion: "LISTO_PARA_ENVIO",
      },
    }),

    // ENVIADO (ya despachadas)
    prisma.venta.create({
      data: {
        product_id: honrarLaVida.id,
        order_id_externo: "order-demo-008",
        buyer_id_externo: BUYER_B,
        cantidad: 1,
        precio_unitario: honrarLaVida.precio,
        estado_preparacion: "ENVIADO",
      },
    }),
    prisma.venta.create({
      data: {
        product_id: batOutOfHell.id,
        order_id_externo: "order-demo-009",
        buyer_id_externo: BUYER_C,
        cantidad: 1,
        precio_unitario: batOutOfHell.precio,
        estado_preparacion: "ENVIADO",
      },
    }),
    prisma.venta.create({
      data: {
        product_id: darkSide.id,
        order_id_externo: "order-demo-010",
        buyer_id_externo: BUYER_A,
        cantidad: 1,
        precio_unitario: darkSide.precio,
        estado_preparacion: "ENVIADO",
      },
    }),
  ]);

  console.log("✓ 10 ventas creadas (3 pendientes, 2 preparando, 2 listas, 3 enviadas)");

  // ── Resumen para verificar ───────────────────────────────────────────────
  const [totalProductos, totalActivos, totalVentas, totalIngresos] = await Promise.all([
    prisma.producto.count(),
    prisma.producto.count({ where: { activo: true } }),
    prisma.venta.count(),
    prisma.venta.aggregate({ _sum: { precio_unitario: true } }),
  ]);

  console.log("");
  console.log("📊 Resumen del seed:");
  console.log(`   Vendedor:         ${vendedor.nombre} (${SELLER_ID})`);
  console.log(`   Admin:            sin perfil vendedor (${ADMIN_ID})`);
  console.log(`   Productos totales: ${totalProductos} (${totalActivos} activos, 1 desactivado)`);
  console.log(`   Ventas:           ${totalVentas}`);
  console.log(`   Ingresos totales: $${Number(totalIngresos._sum.precio_unitario).toLocaleString("es-AR")}`);
  console.log("");
  console.log("✅ Seed completado. Credenciales de acceso:");
  console.log("   /dashboard  → seller_groovy     (contraseña: IAWEB_2026)");
  console.log("   /admin      → admin_seller_groovy (contraseña: IAWEB_2026)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });