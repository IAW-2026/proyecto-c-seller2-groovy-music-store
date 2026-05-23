import { config } from "dotenv";
config({ path: ".env.local" });
import { PrismaClient } from "../app/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed...");

  // Limpiar datos existentes
  await prisma.venta.deleteMany();
  await prisma.producto.deleteMany();
  await prisma.perfilVendedor.deleteMany();

  // Crear vendedores
  const vendedor1 = await prisma.perfilVendedor.create({
    data: {
      clerk_user_id: "user_seed_vendedor_001",
      descripcion: "Especialista en vinilos de rock clásico y jazz",
    },
  });

  const vendedor2 = await prisma.perfilVendedor.create({
    data: {
      clerk_user_id: "user_seed_vendedor_002",
      descripcion: "Coleccionista de música latina y folklore argentino",
    },
  });

  console.log("✓ Vendedores creados");

  // Crear productos del vendedor 1
  const producto1 = await prisma.producto.create({
    data: {
      seller_id: vendedor1.clerk_user_id,
      titulo: "Dark Side of the Moon",
      artista: "Pink Floyd",
      descripcion: "Edición original 1973. Excelente estado.",
      genero: "Rock",
      formato: "VINILO",
      condicion: "COMO_NUEVO",
      precio: 8500,
      stock: 2,
      imagenes: [],
      activo: true,
    },
  });

  const producto2 = await prisma.producto.create({
    data: {
      seller_id: vendedor1.clerk_user_id,
      titulo: "Kind of Blue",
      artista: "Miles Davis",
      descripcion: "Reedición de colección. Estado impecable.",
      genero: "Jazz",
      formato: "VINILO",
      condicion: "NUEVO",
      precio: 6200,
      stock: 1,
      imagenes: [],
      activo: true,
    },
  });

  const producto3 = await prisma.producto.create({
    data: {
      seller_id: vendedor1.clerk_user_id,
      titulo: "Nevermind",
      artista: "Nirvana",
      descripcion: "CD edición especial con booklet.",
      genero: "Rock",
      formato: "CD",
      condicion: "BUENO",
      precio: 1800,
      stock: 5,
      imagenes: [],
      activo: true,
    },
  });

  // Crear productos del vendedor 2
  const producto4 = await prisma.producto.create({
    data: {
      seller_id: vendedor2.clerk_user_id,
      titulo: "Honrar la vida",
      artista: "Mercedes Sosa",
      descripcion: "Vinilo en perfecto estado.",
      genero: "Folklore",
      formato: "VINILO",
      condicion: "BUENO",
      precio: 3500,
      stock: 3,
      imagenes: [],
      activo: true,
    },
  });

  const producto5 = await prisma.producto.create({
    data: {
      seller_id: vendedor2.clerk_user_id,
      titulo: "Obras Cumbres",
      artista: "Astor Piazzolla",
      descripcion: "Doble cassette. Rareza de colección.",
      genero: "Tango",
      formato: "CASSETTE",
      condicion: "ACEPTABLE",
      precio: 2200,
      stock: 1,
      imagenes: [],
      activo: true,
    },
  });

  const producto6 = await prisma.producto.create({
    data: {
      seller_id: vendedor2.clerk_user_id,
      titulo: "La Grasa de las Capitales",
      artista: "Serú Girán",
      descripcion: "CD remasterizado 2001.",
      genero: "Rock Nacional",
      formato: "CD",
      condicion: "NUEVO",
      precio: 2800,
      stock: 4,
      imagenes: [],
      activo: true,
    },
  });

  console.log("✓ Productos creados");

  // Crear ventas en distintos estados
  await prisma.venta.create({
    data: {
      product_id: producto1.id,
      order_id_externo: "order-seed-001",
      buyer_id_externo: "user_seed_buyer_001",
      cantidad: 1,
      precio_unitario: producto1.precio,
      estado_preparacion: "PENDIENTE",
    },
  });

  await prisma.venta.create({
    data: {
      product_id: producto2.id,
      order_id_externo: "order-seed-002",
      buyer_id_externo: "user_seed_buyer_002",
      cantidad: 1,
      precio_unitario: producto2.precio,
      estado_preparacion: "PREPARANDO",
    },
  });

  await prisma.venta.create({
    data: {
      product_id: producto3.id,
      order_id_externo: "order-seed-003",
      buyer_id_externo: "user_seed_buyer_001",
      cantidad: 2,
      precio_unitario: producto3.precio,
      estado_preparacion: "LISTO_PARA_ENVIO",
    },
  });

  await prisma.venta.create({
    data: {
      product_id: producto4.id,
      order_id_externo: "order-seed-004",
      buyer_id_externo: "user_seed_buyer_003",
      cantidad: 1,
      precio_unitario: producto4.precio,
      estado_preparacion: "ENVIADO",
    },
  });

  console.log("✓ Ventas creadas");
  console.log("✅ Seed completado exitosamente");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });