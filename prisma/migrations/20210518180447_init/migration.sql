-- CreateTable
CREATE TABLE "Loan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "due" DATETIME NOT NULL,
    "repaymentAmount" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "accountUsername" TEXT,
    "loanTypeType" TEXT NOT NULL,
    FOREIGN KEY ("loanTypeType") REFERENCES "LoanType" ("type") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("accountUsername") REFERENCES "Account" ("username") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Account" (
    "username" TEXT NOT NULL PRIMARY KEY,
    "credits" INTEGER NOT NULL
);
