/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `LeaveBalance` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "LeaveBalance_user_id_key" ON "public"."LeaveBalance"("user_id");
