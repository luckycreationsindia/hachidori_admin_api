-- DropIndex
DROP INDEX "public"."Schedules_title_key";

-- AlterTable
ALTER TABLE "public"."Schedules" ADD COLUMN     "parentId" INTEGER,
ALTER COLUMN "title" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Schedules" ADD CONSTRAINT "Schedules_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."Schedules"("id") ON DELETE CASCADE ON UPDATE CASCADE;
