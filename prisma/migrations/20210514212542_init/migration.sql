-- CreateTable
CREATE TABLE "Ship" (
    "id" TEXT NOT NULL,
    "class" TEXT NOT NULL,
    "locationSymbol" TEXT,
    "manufacturer" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "plating" INTEGER NOT NULL,
    "weapons" INTEGER NOT NULL,
    "spaceAvailable" INTEGER NOT NULL,
    "maxCargo" INTEGER NOT NULL,
    "destinationSymbol" TEXT,
    "arrivalTime" DATETIME,
    "x" INTEGER NOT NULL,
    "y" INTEGER NOT NULL,
    FOREIGN KEY ("locationSymbol") REFERENCES "Location" ("symbol") ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY ("destinationSymbol") REFERENCES "Location" ("symbol") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Cargo" (
    "goodSymbol" TEXT NOT NULL,
    "shipId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    FOREIGN KEY ("goodSymbol") REFERENCES "Good" ("symbol") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("shipId") REFERENCES "Ship" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Location" (
    "symbol" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "x" INTEGER NOT NULL,
    "y" INTEGER NOT NULL,
    "allowsConstruction" BOOLEAN NOT NULL
);

-- CreateTable
CREATE TABLE "MarkplaceEntry" (
    "locationSymbol" TEXT NOT NULL,
    "goodSymbol" TEXT NOT NULL,
    "quantityAvailable" INTEGER NOT NULL,
    "pricePerUnit" INTEGER NOT NULL,
    "spread" INTEGER NOT NULL,
    "sellPricePerUnit" INTEGER NOT NULL,
    FOREIGN KEY ("locationSymbol") REFERENCES "Location" ("symbol") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("goodSymbol") REFERENCES "Good" ("symbol") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Good" (
    "symbol" TEXT NOT NULL,
    "volumePerUnit" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Ship.id_unique" ON "Ship"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Cargo.goodSymbol_shipId_unique" ON "Cargo"("goodSymbol", "shipId");

-- CreateIndex
CREATE UNIQUE INDEX "Location.symbol_unique" ON "Location"("symbol");

-- CreateIndex
CREATE UNIQUE INDEX "MarkplaceEntry.locationSymbol_goodSymbol_unique" ON "MarkplaceEntry"("locationSymbol", "goodSymbol");

-- CreateIndex
CREATE UNIQUE INDEX "Good.symbol_unique" ON "Good"("symbol");
