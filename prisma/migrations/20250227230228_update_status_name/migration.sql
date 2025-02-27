/*
  Warnings:

  - The values [processing,shipped,delivered] on the enum `DeliveryStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "DeliveryStatus_new" AS ENUM ('processando', 'enviado', 'entregue');
ALTER TABLE "deliveries" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "deliveries" ALTER COLUMN "status" TYPE "DeliveryStatus_new" USING ("status"::text::"DeliveryStatus_new");
ALTER TYPE "DeliveryStatus" RENAME TO "DeliveryStatus_old";
ALTER TYPE "DeliveryStatus_new" RENAME TO "DeliveryStatus";
DROP TYPE "DeliveryStatus_old";
ALTER TABLE "deliveries" ALTER COLUMN "status" SET DEFAULT 'processando';
COMMIT;

-- AlterTable
ALTER TABLE "deliveries" ALTER COLUMN "status" SET DEFAULT 'processando';
