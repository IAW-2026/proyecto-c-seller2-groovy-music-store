-- CreateEnum
CREATE TYPE "EstadoReserva" AS ENUM ('ACTIVA', 'CONFIRMADA', 'LIBERADA');

-- CreateTable
CREATE TABLE "Reserva" (
    "id" TEXT NOT NULL,
    "order_id_externo" TEXT NOT NULL,
    "buyer_id_externo" TEXT NOT NULL,
    "seller_id" TEXT NOT NULL,
    "estado" "EstadoReserva" NOT NULL DEFAULT 'ACTIVA',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reserva_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemReserva" (
    "id" TEXT NOT NULL,
    "reserva_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precio_unit" DECIMAL(65,30) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ItemReserva_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Reserva_order_id_externo_key" ON "Reserva"("order_id_externo");

-- AddForeignKey
ALTER TABLE "ItemReserva" ADD CONSTRAINT "ItemReserva_reserva_id_fkey" FOREIGN KEY ("reserva_id") REFERENCES "Reserva"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemReserva" ADD CONSTRAINT "ItemReserva_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
