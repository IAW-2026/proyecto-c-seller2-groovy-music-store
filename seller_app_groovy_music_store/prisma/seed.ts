import { config } from "dotenv";
config({ path: ".env.local" });
import { PrismaClient } from "../app/generated/prisma";

const prisma = new PrismaClient();

// ─── IDs reales de Clerk ───────────────────────────────────────────────────
const SELLER_ID = "user_3EXuSWzfJZGjvTH55jq1VzPWW8l"; // seller+clerktest@iaw.com
const ADMIN_ID  = "user_3EXuajkCf4mvR9zIEjEmJbPdhol"; // admin_seller+clerktest@iaw.com

// ─── Buyer IDs mockeados ───────────────────────────────────────────────────
const BUYER_A = "user_mock_buyer_001";
const BUYER_B = "user_mock_buyer_002";
const BUYER_C = "user_mock_buyer_003";
const BUYER_D = "user_mock_buyer_004";

async function main() {
  console.log("🌱 Iniciando seed...");

  await prisma.itemReserva.deleteMany();
  await prisma.reserva.deleteMany();
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
      codigo_postal: "1043",
    },
  });

  console.log("✓ Perfil vendedor creado:", vendedor.nombre);

  const productos = await Promise.all([

    // ── VINILOS ──────────────────────────────────────────────────────────
    prisma.producto.create({ data: {
      seller_id: SELLER_ID, titulo: "Dark Side of the Moon", artista: "Pink Floyd",
      descripcion: "Edición original 1973. Excelente estado. Incluye pósters originales.",
      genero: "Rock", formato: "VINILO", condicion: "COMO_NUEVO", precio: 8500, stock: 2, imagenes: [], activo: true,
    }}),
    prisma.producto.create({ data: {
      seller_id: SELLER_ID, titulo: "Kind of Blue", artista: "Miles Davis",
      descripcion: "Reedición de colección 180g. Estado impecable.",
      genero: "Jazz", formato: "VINILO", condicion: "NUEVO", precio: 6200, stock: 3, imagenes: [], activo: true,
    }}),
    prisma.producto.create({ data: {
      seller_id: SELLER_ID, titulo: "Honrar la Vida", artista: "Mercedes Sosa",
      descripcion: "Vinilo en perfecto estado. Edición argentina original.",
      genero: "Folklore", formato: "VINILO", condicion: "BUENO", precio: 3500, stock: 1, imagenes: [], activo: true,
    }}),
    prisma.producto.create({ data: {
      seller_id: SELLER_ID, titulo: "Thriller", artista: "Michael Jackson",
      descripcion: "Vinilo original 1982. Algo de desgaste en la cubierta, disco en buen estado.",
      genero: "Pop", formato: "VINILO", condicion: "BUENO", precio: 4800, stock: 1, imagenes: [], activo: true,
    }}),
    prisma.producto.create({ data: {
      seller_id: SELLER_ID, titulo: "Led Zeppelin IV", artista: "Led Zeppelin",
      descripcion: "Reedición remasterizada. Stairway to Heaven en vinilo, como debe ser.",
      genero: "Rock", formato: "VINILO", condicion: "NUEVO", precio: 7200, stock: 2, imagenes: [], activo: true,
    }}),
    prisma.producto.create({ data: {
      seller_id: SELLER_ID, titulo: "Rumours", artista: "Fleetwood Mac",
      descripcion: "Edición especial 45 aniversario. 180g. Sin uso.",
      genero: "Rock", formato: "VINILO", condicion: "NUEVO", precio: 9100, stock: 1, imagenes: [], activo: true,
    }}),
    prisma.producto.create({ data: {
      seller_id: SELLER_ID, titulo: "A Love Supreme", artista: "John Coltrane",
      descripcion: "Prensado original Impulse! Records. Tapa con desgaste leve, disco impecable.",
      genero: "Jazz", formato: "VINILO", condicion: "BUENO", precio: 11500, stock: 1, imagenes: [], activo: true,
    }}),
    prisma.producto.create({ data: {
      seller_id: SELLER_ID, titulo: "La Grasa de las Capitales", artista: "Serú Girán",
      descripcion: "Edición argentina original 1979. Clásico del rock nacional.",
      genero: "Rock Nacional", formato: "VINILO", condicion: "ACEPTABLE", precio: 5400, stock: 2, imagenes: [], activo: true,
    }}),
    prisma.producto.create({ data: {
      seller_id: SELLER_ID, titulo: "Tapestry", artista: "Carole King",
      descripcion: "Vinilo 180g reedición. Uno de los álbumes más vendidos de todos los tiempos.",
      genero: "Pop", formato: "VINILO", condicion: "COMO_NUEVO", precio: 6800, stock: 2, imagenes: [], activo: true,
    }}),
    prisma.producto.create({ data: {
      seller_id: SELLER_ID, titulo: "Obras Completas Vol. 1", artista: "Astor Piazzolla",
      descripcion: "Doble vinilo. Edición especial de colección. Perfecto estado.",
      genero: "Tango", formato: "VINILO", condicion: "COMO_NUEVO", precio: 8900, stock: 1, imagenes: [], activo: true,
    }}),

    // ── CDs ───────────────────────────────────────────────────────────────
    prisma.producto.create({ data: {
      seller_id: SELLER_ID, titulo: "Nevermind", artista: "Nirvana",
      descripcion: "CD edición especial con booklet extendido.",
      genero: "Rock", formato: "CD", condicion: "BUENO", precio: 1800, stock: 5, imagenes: [], activo: true,
    }}),
    prisma.producto.create({ data: {
      seller_id: SELLER_ID, titulo: "Folklore", artista: "Taylor Swift",
      descripcion: "CD sellado. Edición estándar.",
      genero: "Pop", formato: "CD", condicion: "NUEVO", precio: 3200, stock: 3, imagenes: [], activo: true,
    }}),
    prisma.producto.create({ data: {
      seller_id: SELLER_ID, titulo: "OK Computer", artista: "Radiohead",
      descripcion: "CD remasterizado OKNOTOK 1997-2017. Booklet completo.",
      genero: "Rock", formato: "CD", condicion: "COMO_NUEVO", precio: 2600, stock: 2, imagenes: [], activo: true,
    }}),
    prisma.producto.create({ data: {
      seller_id: SELLER_ID, titulo: "Goodbye Yellow Brick Road", artista: "Elton John",
      descripcion: "Doble CD remasterizado. 17 temas clásicos.",
      genero: "Pop", formato: "CD", condicion: "BUENO", precio: 2100, stock: 4, imagenes: [], activo: true,
    }}),
    prisma.producto.create({ data: {
      seller_id: SELLER_ID, titulo: "Unplugged in New York", artista: "Nirvana",
      descripcion: "CD original 1994. Grabación en vivo acústica. Sin rayaduras.",
      genero: "Rock", formato: "CD", condicion: "BUENO", precio: 2400, stock: 3, imagenes: [], activo: true,
    }}),
    prisma.producto.create({ data: {
      seller_id: SELLER_ID, titulo: "Café de los Maestros", artista: "Varios Artistas",
      descripcion: "CD doble. Grandes maestros del tango argentino. Edición especial.",
      genero: "Tango", formato: "CD", condicion: "NUEVO", precio: 2900, stock: 2, imagenes: [], activo: true,
    }}),
    prisma.producto.create({ data: {
      seller_id: SELLER_ID, titulo: "El Amor Después del Amor", artista: "Fito Páez",
      descripcion: "CD original. El álbum más vendido del rock nacional.",
      genero: "Rock Nacional", formato: "CD", condicion: "BUENO", precio: 1600, stock: 6, imagenes: [], activo: true,
    }}),

    // ── CASSETTES ─────────────────────────────────────────────────────────
    prisma.producto.create({ data: {
      seller_id: SELLER_ID, titulo: "Bat Out of Hell", artista: "Meat Loaf",
      descripcion: "Cassette original 1977. Clásico del rock.",
      genero: "Rock", formato: "CASSETTE", condicion: "BUENO", precio: 1500, stock: 2, imagenes: [], activo: true,
    }}),
    prisma.producto.create({ data: {
      seller_id: SELLER_ID, titulo: "Born in the USA", artista: "Bruce Springsteen",
      descripcion: "Cassette original 1984. Funciona perfecto.",
      genero: "Rock", formato: "CASSETTE", condicion: "ACEPTABLE", precio: 1200, stock: 3, imagenes: [], activo: true,
    }}),
    prisma.producto.create({ data: {
      seller_id: SELLER_ID, titulo: "Whitney Houston", artista: "Whitney Houston",
      descripcion: "Cassette debut 1985. Coleccionable. Estado muy bueno.",
      genero: "Pop", formato: "CASSETTE", condicion: "BUENO", precio: 1400, stock: 2, imagenes: [], activo: true,
    }}),
    prisma.producto.create({ data: {
      seller_id: SELLER_ID, titulo: "Charly García en Vivo", artista: "Charly García",
      descripcion: "Cassette en vivo. Rareza del rock nacional. Muy buen estado.",
      genero: "Rock Nacional", formato: "CASSETTE", condicion: "BUENO", precio: 1900, stock: 1, imagenes: [], activo: true,
    }}),
    prisma.producto.create({ data: {
      seller_id: SELLER_ID, titulo: "Tango: Zero Hour", artista: "Astor Piazzolla",
      descripcion: "Cassette original American Clavé Records 1986. Coleccionable.",
      genero: "Tango", formato: "CASSETTE", condicion: "ACEPTABLE", precio: 1700, stock: 1, imagenes: [], activo: true,
    }}),

    // ── DESACTIVADO (para panel admin) ────────────────────────────────────
    prisma.producto.create({ data: {
      seller_id: SELLER_ID, titulo: "Abbey Road", artista: "The Beatles",
      descripcion: "Vinilo con tapa dañada. Disco en buen estado.",
      genero: "Rock", formato: "VINILO", condicion: "ACEPTABLE", precio: 5000, stock: 0, imagenes: [], activo: false,
    }}),
    prisma.producto.create({ data: {
      seller_id: SELLER_ID, titulo: "Back in Black", artista: "AC/DC",
      descripcion: "CD con estuche roto. Se vende solo el disco.",
      genero: "Rock", formato: "CD", condicion: "ACEPTABLE", precio: 800, stock: 0, imagenes: [], activo: false,
    }}),
  ]);

  console.log(`✓ ${productos.length} productos creados (2 desactivados)`);

  const [
    darkSide, kindOfBlue, honrarLaVida, thriller, ledzep, rumours, lovesupreme,
    grasaCapitales, tapestry, obrasPiazzolla,
    nevermind, folkloreTSwift, okComputer, eltonJohn, unplugged, cafeMaestros, fito,
    batOutOfHell, bornUSA, whitney, charlyVivo, tangoZero,
  ] = productos;

  await Promise.all([
    // PENDIENTE
    prisma.venta.create({ data: { product_id: darkSide.id,       order_id_externo: "order-demo-001", buyer_id_externo: BUYER_A, cantidad: 1, precio_unitario: darkSide.precio,       estado_preparacion: "PENDIENTE" }}),
    prisma.venta.create({ data: { product_id: nevermind.id,      order_id_externo: "order-demo-002", buyer_id_externo: BUYER_B, cantidad: 2, precio_unitario: nevermind.precio,      estado_preparacion: "PENDIENTE" }}),
    prisma.venta.create({ data: { product_id: folkloreTSwift.id, order_id_externo: "order-demo-003", buyer_id_externo: BUYER_C, cantidad: 1, precio_unitario: folkloreTSwift.precio, estado_preparacion: "PENDIENTE" }}),
    prisma.venta.create({ data: { product_id: ledzep.id,         order_id_externo: "order-demo-004", buyer_id_externo: BUYER_D, cantidad: 1, precio_unitario: ledzep.precio,         estado_preparacion: "PENDIENTE" }}),
    prisma.venta.create({ data: { product_id: eltonJohn.id,      order_id_externo: "order-demo-005", buyer_id_externo: BUYER_A, cantidad: 1, precio_unitario: eltonJohn.precio,      estado_preparacion: "PENDIENTE" }}),

    // PREPARANDO
    prisma.venta.create({ data: { product_id: kindOfBlue.id,     order_id_externo: "order-demo-006", buyer_id_externo: BUYER_B, cantidad: 1, precio_unitario: kindOfBlue.precio,     estado_preparacion: "PREPARANDO" }}),
    prisma.venta.create({ data: { product_id: thriller.id,       order_id_externo: "order-demo-007", buyer_id_externo: BUYER_C, cantidad: 1, precio_unitario: thriller.precio,       estado_preparacion: "PREPARANDO" }}),
    prisma.venta.create({ data: { product_id: okComputer.id,     order_id_externo: "order-demo-008", buyer_id_externo: BUYER_D, cantidad: 1, precio_unitario: okComputer.precio,     estado_preparacion: "PREPARANDO" }}),
    prisma.venta.create({ data: { product_id: batOutOfHell.id,   order_id_externo: "order-demo-009", buyer_id_externo: BUYER_A, cantidad: 2, precio_unitario: batOutOfHell.precio,   estado_preparacion: "PREPARANDO" }}),

    // LISTO_PARA_ENVIO
    prisma.venta.create({ data: { product_id: grasaCapitales.id, order_id_externo: "order-demo-010", buyer_id_externo: BUYER_B, cantidad: 1, precio_unitario: grasaCapitales.precio, estado_preparacion: "LISTO_PARA_ENVIO" }}),
    prisma.venta.create({ data: { product_id: obrasPiazzolla.id, order_id_externo: "order-demo-011", buyer_id_externo: BUYER_C, cantidad: 1, precio_unitario: obrasPiazzolla.precio, estado_preparacion: "LISTO_PARA_ENVIO" }}),
    prisma.venta.create({ data: { product_id: tapestry.id,       order_id_externo: "order-demo-012", buyer_id_externo: BUYER_D, cantidad: 1, precio_unitario: tapestry.precio,       estado_preparacion: "LISTO_PARA_ENVIO" }}),
    prisma.venta.create({ data: { product_id: unplugged.id,      order_id_externo: "order-demo-013", buyer_id_externo: BUYER_A, cantidad: 1, precio_unitario: unplugged.precio,      estado_preparacion: "LISTO_PARA_ENVIO" }}),

    // ENVIADO
    prisma.venta.create({ data: { product_id: honrarLaVida.id,   order_id_externo: "order-demo-014", buyer_id_externo: BUYER_B, cantidad: 1, precio_unitario: honrarLaVida.precio,   estado_preparacion: "ENVIADO" }}),
    prisma.venta.create({ data: { product_id: rumours.id,        order_id_externo: "order-demo-015", buyer_id_externo: BUYER_C, cantidad: 1, precio_unitario: rumours.precio,        estado_preparacion: "ENVIADO" }}),
    prisma.venta.create({ data: { product_id: fito.id,           order_id_externo: "order-demo-016", buyer_id_externo: BUYER_D, cantidad: 2, precio_unitario: fito.precio,           estado_preparacion: "ENVIADO" }}),
    prisma.venta.create({ data: { product_id: cafeMaestros.id,   order_id_externo: "order-demo-017", buyer_id_externo: BUYER_A, cantidad: 1, precio_unitario: cafeMaestros.precio,   estado_preparacion: "ENVIADO" }}),
    prisma.venta.create({ data: { product_id: lovesupreme.id,    order_id_externo: "order-demo-018", buyer_id_externo: BUYER_B, cantidad: 1, precio_unitario: lovesupreme.precio,    estado_preparacion: "ENVIADO" }}),
    prisma.venta.create({ data: { product_id: bornUSA.id,        order_id_externo: "order-demo-019", buyer_id_externo: BUYER_C, cantidad: 2, precio_unitario: bornUSA.precio,        estado_preparacion: "ENVIADO" }}),
    prisma.venta.create({ data: { product_id: charlyVivo.id,     order_id_externo: "order-demo-020", buyer_id_externo: BUYER_D, cantidad: 1, precio_unitario: charlyVivo.precio,     estado_preparacion: "ENVIADO" }}),
  ]);

  console.log("✓ 20 ventas creadas (5 pendientes, 4 preparando, 4 listas, 7 enviadas)");

  const [totalProductos, totalActivos, totalVentas, totalIngresos] = await Promise.all([
    prisma.producto.count(),
    prisma.producto.count({ where: { activo: true } }),
    prisma.venta.count(),
    prisma.venta.aggregate({ _sum: { precio_unitario: true } }),
  ]);

  console.log("");
  console.log("📊 Resumen del seed:");
  console.log(`   Vendedor:          Groovy Records (${SELLER_ID})`);
  console.log(`   Admin:             sin perfil vendedor (${ADMIN_ID})`);
  console.log(`   Productos totales: ${totalProductos} (${totalActivos} activos, 2 desactivados)`);
  console.log(`   Ventas:            ${totalVentas}`);
  console.log(`   Ingresos totales:  $${Number(totalIngresos._sum.precio_unitario).toLocaleString("es-AR")}`);
  console.log("");
  console.log("✅ Seed completado. Credenciales de acceso:");
  console.log("   /dashboard  → seller+clerktest@iaw.com      (contraseña: iawuser#)");
  console.log("   /admin      → admin_seller+clerktest@iaw.com (contraseña: iawuser#)");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });