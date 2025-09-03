-- CreateTable
CREATE TABLE "public"."Schedules" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "userId" INTEGER NOT NULL,
    "data" TEXT NOT NULL,
    "startDate" TIMESTAMPTZ(6) NOT NULL,
    "endDate" TIMESTAMPTZ(6) NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "Schedules_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Schedules_title_key" ON "public"."Schedules"("title");

-- CreateIndex
CREATE INDEX "Schedules_userId_idx" ON "public"."Schedules"("userId");

-- CreateIndex
CREATE INDEX "Schedules_title_idx" ON "public"."Schedules"("title");

-- CreateIndex
CREATE INDEX "Schedules_startDate_idx" ON "public"."Schedules"("startDate");

-- CreateIndex
CREATE INDEX "Schedules_endDate_idx" ON "public"."Schedules"("endDate");

-- CreateIndex
CREATE INDEX "Schedules_startDate_endDate_idx" ON "public"."Schedules"("startDate", "endDate");

-- AddForeignKey
ALTER TABLE "public"."Schedules" ADD CONSTRAINT "Schedules_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
