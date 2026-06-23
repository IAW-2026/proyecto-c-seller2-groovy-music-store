/*
  Warnings:

  - You are about to drop the column `cantidad` on the `Venta` table. All the data in the column will be lost.
  - You are about to drop the column `precio_unitario` on the `Venta` table. All the data in the column will be lost.
  - You are about to drop the column `product_id` on the `Venta` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[order_id_externo]` on the table `Venta` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `seller_id` to the `Venta` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Venta" DROP CONSTRAINT "Venta_product_id_fkey";

-- AlterTable
ALTER TABLE "Venta" DROP COLUMN "cantidad",
DROP COLUMN "precio_unitario",
DROP COLUMN "product_id",
ADD COLUMN     "seller_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "ItemVenta" (
    "id" TEXT NOT NULL,
    "venta_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precio_unit" DECIMAL(65,30) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ItemVenta_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Venta_order_id_externo_key" ON "Venta"("order_id_externo");

-- AddForeignKey
ALTER TABLE "ItemVenta" ADD CONSTRAINT "ItemVenta_venta_id_fkey" FOREIGN KEY ("venta_id") REFERENCES "Venta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemVenta" ADD CONSTRAINT "ItemVenta_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
