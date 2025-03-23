-- CreateTable
CREATE TABLE "Message" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "topic" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "ListenerProgress" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "listenerId" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "lastSeenId" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ListenerProgress_listenerId_topic_key" ON "ListenerProgress"("listenerId", "topic");
