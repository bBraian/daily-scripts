-- CreateTable
CREATE TABLE "scripts" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "scriptTypeId" INTEGER NOT NULL,
    "expectedReturnId" INTEGER NOT NULL,
    "sqlQuery" TEXT NOT NULL,
    "createdTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "scripts_scriptTypeId_fkey" FOREIGN KEY ("scriptTypeId") REFERENCES "scripts_types" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "scripts_expectedReturnId_fkey" FOREIGN KEY ("expectedReturnId") REFERENCES "expected_scripts_return" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "scripts_types" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "expected_scripts_return" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "scriptTypeId" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    CONSTRAINT "expected_scripts_return_scriptTypeId_fkey" FOREIGN KEY ("scriptTypeId") REFERENCES "scripts_types" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
