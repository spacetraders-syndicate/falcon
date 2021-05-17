-- CreateTable
CREATE TABLE "RestrictedGoodsOnShipType" (
    "goodSymbol" TEXT NOT NULL,
    "shipTypeType" TEXT NOT NULL,

    PRIMARY KEY ("goodSymbol", "shipTypeType"),
    FOREIGN KEY ("goodSymbol") REFERENCES "GoodType" ("symbol") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("shipTypeType") REFERENCES "ShipType" ("type") ON DELETE CASCADE ON UPDATE CASCADE
);
