-- CreateEnum
CREATE TYPE "public"."RoleName" AS ENUM ('employee', 'hr', 'boss');

-- CreateEnum
CREATE TYPE "public"."Status" AS ENUM ('pending', 'approved', 'rejected', 'partial', 'withdrawn', 'custom_message');

-- CreateTable
CREATE TABLE "public"."Role" (
    "role_id" SERIAL NOT NULL,
    "role_name" "public"."RoleName" NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("role_id")
);

-- CreateTable
CREATE TABLE "public"."User" (
    "user_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "public"."LeaveRequest" (
    "leave_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "type" TEXT NOT NULL,
    "reason" TEXT,
    "status" "public"."Status" NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LeaveRequest_pkey" PRIMARY KEY ("leave_id")
);

-- CreateTable
CREATE TABLE "public"."LeaveBalance" (
    "balance_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "total_leaves" INTEGER NOT NULL DEFAULT 30,
    "used_leaves" INTEGER NOT NULL DEFAULT 0,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LeaveBalance_pkey" PRIMARY KEY ("balance_id")
);

-- CreateTable
CREATE TABLE "public"."LeaveAction" (
    "action_id" SERIAL NOT NULL,
    "leave_id" INTEGER NOT NULL,
    "action_by" INTEGER NOT NULL,
    "action" "public"."Status" NOT NULL,
    "remarks" TEXT,
    "action_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LeaveAction_pkey" PRIMARY KEY ("action_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Role_role_name_key" ON "public"."Role"("role_name");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "public"."Role"("role_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LeaveRequest" ADD CONSTRAINT "LeaveRequest_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LeaveBalance" ADD CONSTRAINT "LeaveBalance_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LeaveAction" ADD CONSTRAINT "LeaveAction_leave_id_fkey" FOREIGN KEY ("leave_id") REFERENCES "public"."LeaveRequest"("leave_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LeaveAction" ADD CONSTRAINT "LeaveAction_action_by_fkey" FOREIGN KEY ("action_by") REFERENCES "public"."User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
