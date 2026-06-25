-- CreateTable
CREATE TABLE "RegistroBalance" (
    "id" TEXT NOT NULL,
    "seller_id" TEXT NOT NULL,
    "balance_retenido" DECIMAL(65,30) NOT NULL,
    "balance_acreditado" DECIMAL(65,30) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RegistroBalance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RegistroBalance_seller_id_created_at_idx" ON "RegistroBalance"("seller_id", "created_at");
