-- CreateTable
CREATE TABLE "public"."ScheduleStatus" (
    "id" SERIAL NOT NULL,
    "scheduleId" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScheduleStatus_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ScheduleStatus_scheduleId_idx" ON "public"."ScheduleStatus"("scheduleId");

-- CreateIndex
CREATE INDEX "ScheduleStatus_status_idx" ON "public"."ScheduleStatus"("status");

-- CreateIndex
CREATE INDEX "ScheduleStatus_scheduleId_status_idx" ON "public"."ScheduleStatus"("scheduleId", "status");

-- AddForeignKey
ALTER TABLE "public"."ScheduleStatus" ADD CONSTRAINT "ScheduleStatus_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "public"."Schedules"("id") ON DELETE CASCADE ON UPDATE CASCADE;
