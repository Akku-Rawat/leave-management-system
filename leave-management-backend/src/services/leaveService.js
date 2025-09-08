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
      status: "pending",
      duration: data.duration || null,
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

    const remainingLeaves = totalLeaves - usedLeaves;

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

export const createNotification = async (userId, message) => {
  return await prisma.notification.create({
    data,
  });
};

// Update leave status and adjust used leaves accordingly
export const updateLeaveStatus = async (leave_id, status) => {
  if (!status) throw new Error("Status is required");

  const normalizedStatus = status.toLowerCase();

  try {
    // Update the leave status
    const leave = await prisma.leaveRequest.update({
      where: { leave_id: parseInt(leave_id) },
      data: { status: normalizedStatus },
    });

    // Create notification message based on status
    const messageMap = {
      approved: `Your leave request from ${leave.start_date.toISOString().slice(0, 10)} to ${leave.end_date.toISOString().slice(0, 10)} has been approved.`,
      rejected: `Your leave request from ${leave.start_date.toISOString().slice(0, 10)} to ${leave.end_date.toISOString().slice(0, 10)} has been rejected.`,
      withdrawn: `Your leave request from ${leave.start_date.toISOString().slice(0, 10)} to ${leave.end_date.toISOString().slice(0, 10)} has been withdrawn.`,
      // add others if necessary
    };

    if (messageMap[normalizedStatus]) {
      await createNotification(leave.user_id, messageMap[normalizedStatus]);
    }

    if (normalizedStatus === "approved" || normalizedStatus === "rejected") {
      // Calculate used leaves based on duration (number of days)
      const approvedLeaves = await prisma.leaveRequest.findMany({
        where: { user_id: leave.user_id, status: "approved" },
      });

      const usedLeaves = approvedLeaves.reduce((acc, leave) => {
        if (leave.duration === "first" || leave.duration === "second") {
          return acc + 0.5;
        }
        const start = new Date(leave.start_date);
        const end = new Date(leave.end_date);
        const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        return acc + days;
      }, 0);

      // Update leave balance used_leaves
      await prisma.leaveBalance.updateMany({
        where: { user_id: leave.user_id },
        data: { used_leaves: usedLeaves },
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