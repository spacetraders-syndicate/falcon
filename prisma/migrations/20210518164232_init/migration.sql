-- CreateTable
CREATE TABLE "GoodType" (
    "name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL PRIMARY KEY,
    "volumePerUnit" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "LoanType" (
    "type" TEXT NOT NULL PRIMARY KEY,
    "amount" INTEGER NOT NULL,
    "collateralRequired" BOOLEAN NOT NULL,
    "rate" INTEGER NOT NULL,
    "termInDays" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "LocationType" (
    "type" TEXT NOT NULL PRIMARY KEY
);

-- CreateTable
CREATE TABLE "StructureType" (
    "type" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "StructureTypeProducingGoodType" (
    "goodTypeSymbol" TEXT NOT NULL,
    "structureTypeType" TEXT NOT NULL,

    PRIMARY KEY ("goodTypeSymbol", "structureTypeType"),
    FOREIGN KEY ("goodTypeSymbol") REFERENCES "GoodType" ("symbol") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("structureTypeType") REFERENCES "StructureType" ("type") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "StructureTypeConsumingGoodType" (
    "goodTypeSymbol" TEXT NOT NULL,
    "structureTypeType" TEXT NOT NULL,

    PRIMARY KEY ("goodTypeSymbol", "structureTypeType"),
    FOREIGN KEY ("goodTypeSymbol") REFERENCES "GoodType" ("symbol") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("structureTypeType") REFERENCES "StructureType" ("type") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ShipType" (
    "class" TEXT NOT NULL,
    "manufacturer" TEXT NOT NULL,
    "maxCargo" INTEGER NOT NULL,
    "plating" INTEGER NOT NULL,
    "speed" INTEGER NOT NULL,
    "type" TEXT NOT NULL PRIMARY KEY,
    "weapons" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "RestrictedGoodsOnShipType" (
    "goodSymbol" TEXT NOT NULL,
    "shipTypeType" TEXT NOT NULL,

    PRIMARY KEY ("goodSymbol", "shipTypeType"),
    FOREIGN KEY ("goodSymbol") REFERENCES "GoodType" ("symbol") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("shipTypeType") REFERENCES "ShipType" ("type") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Ship" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "class" TEXT NOT NULL,
    "locationSymbol" TEXT,
    "manufacturer" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "spaceAvailable" INTEGER NOT NULL,
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

    PRIMARY KEY ("goodSymbol", "shipId"),
    FOREIGN KEY ("goodSymbol") REFERENCES "GoodType" ("symbol") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("shipId") REFERENCES "Ship" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "System" (
    "symbol" TEXT NOT NULL,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Location" (
    "symbol" TEXT NOT NULL PRIMARY KEY,
    "systemSymbol" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "x" INTEGER NOT NULL,
    "y" INTEGER NOT NULL,
    "allowsConstruction" BOOLEAN NOT NULL,
    FOREIGN KEY ("systemSymbol") REFERENCES "System" ("symbol") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MarkplaceEntry" (
    "locationSymbol" TEXT NOT NULL,
    "goodSymbol" TEXT NOT NULL,
    "quantityAvailable" INTEGER NOT NULL,
    "pricePerUnit" INTEGER NOT NULL,
    "spread" INTEGER NOT NULL,
    "sellPricePerUnit" INTEGER NOT NULL,

    PRIMARY KEY ("locationSymbol", "goodSymbol"),
    FOREIGN KEY ("locationSymbol") REFERENCES "Location" ("symbol") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("goodSymbol") REFERENCES "GoodType" ("symbol") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_LocationTypeToStructureType" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    FOREIGN KEY ("A") REFERENCES "LocationType" ("type") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("B") REFERENCES "StructureType" ("type") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "System.symbol_unique" ON "System"("symbol");

-- CreateIndex
CREATE UNIQUE INDEX "_LocationTypeToStructureType_AB_unique" ON "_LocationTypeToStructureType"("A", "B");

-- CreateIndex
CREATE INDEX "_LocationTypeToStructureType_B_index" ON "_LocationTypeToStructureType"("B");
