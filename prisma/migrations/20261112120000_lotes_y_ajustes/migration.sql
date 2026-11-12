-- CreateTable
CREATE TABLE "Lote" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "shop" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "codigoLote" TEXT NOT NULL,
    "caducidad" DATETIME NOT NULL,
    "unidades" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Ajustes" (
    "shop" TEXT NOT NULL PRIMARY KEY,
    "umbralStock" INTEGER NOT NULL DEFAULT 10,
    "diasCaducidad" INTEGER NOT NULL DEFAULT 60
);

-- CreateIndex
CREATE INDEX "Lote_shop_caducidad_idx" ON "Lote"("shop", "caducidad");

-- CreateIndex
CREATE UNIQUE INDEX "Lote_shop_variantId_codigoLote_key" ON "Lote"("shop", "variantId", "codigoLote");
