-- DropForeignKey
ALTER TABLE "public"."Vehicle" DROP CONSTRAINT "Vehicle_clientId_fkey";

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;
