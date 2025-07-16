-- CreateTable
CREATE TABLE "HistoryEvent" (
    "id" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "duration" INTEGER,
    "humidity" DOUBLE PRECISION,
    "temperature" DOUBLE PRECISION,
    "weather" TEXT,
    "source" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HistoryEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ZoneOnHistoryEvent" (
    "historyEventId" TEXT NOT NULL,
    "zoneId" TEXT NOT NULL,

    CONSTRAINT "ZoneOnHistoryEvent_pkey" PRIMARY KEY ("historyEventId","zoneId")
);

-- AddForeignKey
ALTER TABLE "ZoneOnHistoryEvent" ADD CONSTRAINT "ZoneOnHistoryEvent_historyEventId_fkey" FOREIGN KEY ("historyEventId") REFERENCES "HistoryEvent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ZoneOnHistoryEvent" ADD CONSTRAINT "ZoneOnHistoryEvent_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "Zone"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
