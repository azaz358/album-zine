/*
  Warnings:

  - You are about to drop the column `pageLayout` on the `submissions` table. All the data in the column will be lost.
  - Added the required column `mailingAddress` to the `submissions` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_submissions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "firstName" TEXT NOT NULL,
    "lastInitial" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "mailingAddress" TEXT NOT NULL,
    "albumName" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "yearReleased" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "pageScreenshot" TEXT
);
INSERT INTO "new_submissions" ("albumName", "artist", "createdAt", "email", "firstName", "id", "lastInitial", "updatedAt", "yearReleased") SELECT "albumName", "artist", "createdAt", "email", "firstName", "id", "lastInitial", "updatedAt", "yearReleased" FROM "submissions";
DROP TABLE "submissions";
ALTER TABLE "new_submissions" RENAME TO "submissions";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
