/*
  Warnings:

  - You are about to drop the `LocationTypeAllowedStructureType` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "LocationTypeAllowedStructureType";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "_LocationTypeToStructureType" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    FOREIGN KEY ("A") REFERENCES "LocationType" ("type") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("B") REFERENCES "StructureType" ("type") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_LocationTypeToStructureType_AB_unique" ON "_LocationTypeToStructureType"("A", "B");

-- CreateIndex
CREATE INDEX "_LocationTypeToStructureType_B_index" ON "_LocationTypeToStructureType"("B");
