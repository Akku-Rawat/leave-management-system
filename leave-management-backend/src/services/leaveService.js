import prisma from "../../prisma/client.js";
import { sendLeaveMail } from "./emailService.js";

export const applyLeave = async (data, user) => {
  const leave = await prisma.leaveRequest.create({
    data: {
      user_id: user.user_id,
      start_date: new Date(data.startDate),
      end_date: new Date(data.endDate),
      reason: data.reason || null,
      type: data.type,
      status: "pending", // initially pending
    },
  });
  await sendLeaveMail(leave, user);
  return leave;
};

// Get user leave statistics
export const getUserStats = async (req, res) => {
  try {
    const userId = req.user.user_id;

    const leaveBalance = await prisma.leaveBalance.findFirst({
      where: { user_id: userId },
    });

    // Default totalLeaves to 30 if not found
    const totalLeaves = Number(leaveBalance?.total_leaves) || 30;

    // Count how many leaves are approved for usedLeaves
    const usedLeaves = await prisma.leaveRequest.count({
      where: { user_id: userId, status: "approved" },
    });

    // Count how many leaves are pending as pendingLeaves
    const pendingLeaves = await prisma.leaveRequest.count({
      where: { user_id: userId, status: "pending" },
    });

    const remainingLeaves = totalLeaves - usedLeaves - pendingLeaves;

    res.json({
      totalLeaves,
      usedLeaves,
      pendingLeaves,
      remainingLeaves: remainingLeaves > 0 ? remainingLeaves : 0,
    });
  } catch (error) {
    console.error("Error in getUserStats:", error);
    res.status(500).json({ error: error.message });
  }
};

// Update leave status and adjust used leaves accordingly
export const updateLeaveStatus = async (leave_id, status) => {
  if (!status) throw new Error("Status is required");
  const normalizedStatus = status.toLowerCase();

  try {
    const leave = await prisma.leaveRequest.update({
      where: { leave_id: parseInt(leave_id) },
      data: { status: normalizedStatus },
    });

    if (normalizedStatus === "approved" || normalizedStatus === "rejected") {
      const leaveCount = await prisma.leaveRequest.count({
        where: { user_id: leave.user_id, status: "approved" },
      });

      await prisma.leaveBalance.updateMany({
        where: { user_id: leave.user_id },
        data: { used_leaves: leaveCount },
      });
    }

    return leave;
  } catch (err) {
    console.error("Error in updateLeaveStatus:", err);
    if (err.code === "P2025") {
      return null;
    }
    throw err;
  }
};

// Withdraw leave request
export const withdrawLeave = async (leave_id) => {
  try {
    const leave = await prisma.leaveRequest.findUnique({
      where: { leave_id: parseInt(leave_id) },
    });
    if (!leave) return null;

    if (leave.status !== "pending") {
      throw new Error("Only pending leaves can be withdrawn");
    }

    const updatedLeave = await prisma.leaveRequest.update({
      where: { leave_id: parseInt(leave_id) },
      data: { status: "withdrawn" },
    });

    return updatedLeave;
  } catch (err) {
    throw err;
  }
};


export const getRemainingLeaveBalance = async (userId) => {
  const balance = await prisma.leaveBalance.findFirst({
    where: { user_id: userId },
  });
  if (!balance) throw new Error("Leave balance not found");

  const remaining = balance.total_leaves - balance.used_leaves;
  return {
    totalLeaves: balance.total_leaves,
    usedLeaves: balance.used_leaves,
    remainingLeaves: remaining,
  };
};

export const processLeaveEncashment = async (userId, action) => {


  if (action === "cash_encash") {
    await prisma.leaveBalance.update({
      where: { user_id: userId },
      data: {
        used_leaves: { increment: (await getRemainingLeaveBalance(userId)).remainingLeaves },
      },
    });
    return { message: "Leaves encashed successfully" };
  } else if (action === "carry_forward") {
    return { message: "Leaves carried forward successfully" };
  }
};