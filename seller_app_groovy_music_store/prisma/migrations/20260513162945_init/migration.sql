-- CreateEnum
CREATE TYPE "Formato" AS ENUM ('VINILO', 'CD', 'CASSETTE', 'MERCHANDISE', 'OTRO');

-- CreateEnum
CREATE TYPE "Condicion" AS ENUM ('NUEVO', 'COMO_NUEVO', 'BUENO', 'ACEPTABLE');

-- CreateEnum
CREATE TYPE "EstadoPreparacion" AS ENUM ('PENDIENTE', 'PREPARANDO', 'LISTO_PARA_ENVIO', 'ENVIADO');

-- CreateTable
CREATE TABLE "PerfilVendedor" (
    "clerk_user_id" TEXT NOT NULL,
    "descripcion" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PerfilVendedor_pkey" PRIMARY KEY ("clerk_user_id")
);

-- CreateTable
CREATE TABLE "Producto" (
    "id" TEXT NOT NULL,
    "seller_id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT,
    "artista" TEXT NOT NULL,
    "genero" TEXT NOT NULL,
    "formato" "Formato" NOT NULL,
    "condicion" "Condicion" NOT NULL,
    "precio" DECIMAL(65,30) NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "imagenes" TEXT[],
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Producto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Venta" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "order_id_externo" TEXT NOT NULL,
    "buyer_id_externo" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL DEFAULT 1,
    "precio_unitario" DECIMAL(65,30) NOT NULL,
    "estado_preparacion" "EstadoPreparacion" NOT NULL DEFAULT 'PENDIENTE',
    "envio_id_externo" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Venta_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Producto" ADD CONSTRAINT "Producto_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "PerfilVendedor"("clerk_user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Venta" ADD CONSTRAINT "Venta_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
