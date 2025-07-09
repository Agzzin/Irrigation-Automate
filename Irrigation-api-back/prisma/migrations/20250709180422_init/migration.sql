-- CreateTable
CREATE TABLE "Zone" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "flowRate" DOUBLE PRECISION NOT NULL,
    "pressure" DOUBLE PRECISION NOT NULL,
    "emitterCount" INTEGER NOT NULL,
    "emitterSpacing" INTEGER NOT NULL,
    "lastWatered" TIMESTAMP(3),
    "nextWatering" TIMESTAMP(3),
    "scheduleId" TEXT NOT NULL,

    CONSTRAINT "Zone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Schedule" (
    "id" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "frequency" TEXT NOT NULL,
    "days" INTEGER[],

    CONSTRAINT "Schedule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Zone_scheduleId_key" ON "Zone"("scheduleId");

-- AddForeignKey
ALTER TABLE "Zone" ADD CONSTRAINT "Zone_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
