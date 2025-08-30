import prisma from "../../prisma/client.js";
import { sendLeaveMail } from "./emailService.js";

export const applyLeave = async (data, user) => {
  const leave = await prisma.leaveRequest.create({
    data: {
      user_id: user.user_id,
      start_date: new Date(data.start_date),
      end_date: new Date(data.end_date),
      reason: data.reason || null,  // optional in schema
      type: data.type,
      status: "pending"  // default status at creation
    },
  });

  await sendLeaveMail(leave, user);
  return leave;
};

export const updateLeaveStatus = async (leave_id, status) => {
  const normalizedStatus = status.toLowerCase(); // Match Status enum values

  try {
    const leave = await prisma.leaveRequest.update({
      where: { leave_id: parseInt(leave_id) },
      data: { status: normalizedStatus },
    });
    return leave;
  } catch (err) {
    if (err.code === "P2025") {
      // Record not found
      return null;
    }
    throw err;
  }
};