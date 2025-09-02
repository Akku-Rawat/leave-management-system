import { applyLeave, updateLeaveStatus } from "../services/leaveService.js";
import prisma from "../../prisma/client.js";


// Leave Request Create करना
export const createLeave = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { user_id: req.user.user_id },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const leave = await applyLeave(req.body, user);

    res.json({ success: true, leave });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Logged-in user के Leave records Fetch करना
export const getMyLeaves = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const leaves = await prisma.leaveRequest.findMany({
      where: { user_id: userId },
      include: {
        user: true,
      },
      orderBy: {
        leave_id: 'desc',  // descending order by leave_id
      },
    });
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// User के Leave stats (total, used, pending) प्राप्त करना
export const getUserStats = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const totalLeaves = await prisma.leaveRequest.count({
      where: { user_id: userId },
    });
    const usedLeaves = await prisma.leaveRequest.count({
      where: { user_id: userId, status: "approved" },
    });
    const pendingLeaves = await prisma.leaveRequest.count({
      where: { user_id: userId, status: "pending" },
    });

    res.json({
      totalLeaves,
      usedLeaves,
      pendingLeaves,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Leave Request Approve करना
export const approveLeave = async (req, res) => {
  try {
    const leave = await updateLeaveStatus(req.params.id, "approved");

    if (!leave) {
      return res.status(404).send("Leave not found");
    }

    res.send("<h2>Leave Approved ✅</h2>");
  } catch (err) {
    res.status(500).send("Error approving leave");
  }
};

// Leave Request Reject करना
export const rejectLeave = async (req, res) => {
  try {
    const leave = await updateLeaveStatus(req.params.id, "rejected");

    if (!leave) {
      return res.status(404).send("Leave not found");
    }

    res.send("<h2>Leave Rejected ❌</h2>");
  } catch (err) {
    res.status(500).send("Error rejecting leave");
  }
};


// New controller: Get all leave requests for HR
export const getAllLeaveRequests = async (req, res) => {
  try {
    // Role check, allow only hr or boss
    if (req.user.role !== "hr" && req.user.role !== "boss") {
      return res.status(403).json({ message: "Forbidden: Access denied" });
    }

    // Fetch all leaves with user details
    const leaves = await prisma.leaveRequest.findMany({
      include: {
        user: true,
      },
      orderBy: {
        leave_id: "desc",
      },
    });

    res.json(leaves);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};