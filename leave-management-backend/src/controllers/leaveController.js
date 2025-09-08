import { applyLeave, updateLeaveStatus } from "../services/leaveService.js";
import prisma from "../../prisma/client.js";
import jwt from 'jsonwebtoken';
import { withdrawLeave ,getRemainingLeaveBalance,processLeaveEncashment } from '../services/leaveService.js';
import { sendCustomMessageEmail } from './emailService.js';

// Leave Request Create
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

// Logged-in user Leave records Fetch
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


// User के Leave stats (total, used, pending) प
export const getUserStats = async (req, res) => {
  try {
    const userId = req.user.user_id;

    // LeaveBalance record fetch karo
    const leaveBalance = await prisma.leaveBalance.findFirst({
      where: { user_id: userId },
    });

    // Used aur total leaves number me le lo, default set karo
    const totalLeaves = Number(leaveBalance?.total_leaves) || 30;
    const usedLeaves = Number(leaveBalance?.used_leaves) || 0;

    // Pending leaves count karo from LeaveRequest table
    const pendingLeaves = await prisma.leaveRequest.count({
      where: { user_id: userId, status: "pending" },
    });

    // Remaining calculate karo
    const remainingLeaves = totalLeaves - usedLeaves ;

    // Response me numbers bhejo zero fallback ke sath
    res.json({
  totalLeaves: totalLeaves || 0,
  usedLeaves: usedLeaves || 0,
  pendingLeaves: pendingLeaves || 0,
  remainingLeaves: remainingLeaves > 0 ? remainingLeaves : 0,
});

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Leave Request Approve
export const approveLeave = async (req, res) => {
  try {
    const leave = await updateLeaveStatus(req.params.id, "approved");

    if (!leave) {
      return res.status(404).json({ error: "Leave not found" });
    }

    res.json({ message: "Leave approved successfully", leave });
  } catch (err) {
    res.status(500).json({ error: "Error approving leave" });
  }
};


// Leave Request Reject 
export const rejectLeave = async (req, res) => {
  try {
    const leave = await updateLeaveStatus(req.params.id, "rejected");

    if (!leave) {
      return res.status(404).json({ error: "Leave not found" });
    }

    res.json({ message: "Leave rejected successfully", leave });
  } catch (err) {
    res.status(500).json({ error: "Error rejecting leave" });
  }
};



// New controller: Get all leave requests for HR
export const getAllLeaveRequests = async (req, res) => {
  try {
    if (req.user.role !== "hr" && req.user.role !== "boss") {
      return res.status(403).json({ message: "Forbidden: Access denied" });
    }

    const leaves = await prisma.leaveRequest.findMany({
      where: { status: "pending" },
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


export const handleLeaveAction = async (req, res) => {
  const { token } = req.query;

  if (!token) return res.status(400).send("<h3>Token required</h3>");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);

    const { leave_id, action } = decoded;
    if (!leave_id || !action) {
      return res.status(400).send("<h3>Token missing leave_id or action</h3>");
    }

    const leave = await updateLeaveStatus(leave_id, action);
    if (!leave) {
      return res.status(404).send("<h3>Leave not found or already processed</h3>");
    }

    const actionText = action === "approved" ? "Approved ✅" : action === "rejected" ? "Rejected ❌" : action;
    return res.send(`<h2>Leave ${actionText}</h2>`);

  } catch (error) {
    console.log('JWT verify error:', error);
    return res.status(400).send("<h3>Invalid or expired token</h3>");
  }
};
export const getAllLeavesWithHistory = async (req, res) => {
  try {
    // Role check, allow only hr or boss
    if (req.user.role !== "hr" && req.user.role !== "boss") {
      return res.status(403).json({ message: "Forbidden: Access denied" });
    }

    // Fetch all leaves with user info and leave actions by users who acted (HR/Boss)
    const leaves = await prisma.leaveRequest.findMany({
      include: {
        user: true, // leave requester info
        LeaveAction: {
          include: {
            user: {
              select: {
                user_id: true,
                name: true,
                role: true,
                email: true,
              },
            },
          },
          orderBy: {
            action_at: "asc",
          },
        },
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

export const withdrawLeaveRequest = async (req, res) => {
  try {
    const leaveId = req.params.id;
    const updatedLeave = await withdrawLeave(leaveId);

    if (!updatedLeave) {
      return res.status(404).json({ error: "Leave request not found" });
    }

    res.json({ success: true, message: "Leave request withdrawn successfully", leave: updatedLeave });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};




export const getRemainingLeaves = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const remainingLeaves = await getRemainingLeaveBalance(userId);
    res.json(remainingLeaves);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const submitEncashment = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { action } = req.body; // action: "carry_forward" or "cash_encash"
    if (!["carry_forward", "cash_encash"].includes(action)) {
      return res.status(400).json({ error: "Invalid action" });
    }
    const result = await processLeaveEncashment(userId, action);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const sendCustomLeaveMessage = async (req, res) => {
  try {
    const leaveId = parseInt(req.params.id);
    const { message } = req.body;
    const actionBy = req.user.user_id;

    if (!message || message.trim() === "") {
      return res.status(400).json({ error: "Message is required." });
    }

    // Save message as a LeaveAction with 'custom_message' status
    await prisma.leaveAction.create({
      data: {
        leave_id: leaveId,
        action_by: actionBy,
        action: "custom_message",
        remarks: message,
      },
    });

    // Fetch the leave request first
    const leave = await prisma.leaveRequest.findUnique({
      where: { leave_id: leaveId },
    });

    if (!leave) {
      return res.status(404).json({ error: "Leave request not found." });
    }

    // Fetch the user who owns the leave
    const user = await prisma.user.findUnique({
      where: { user_id: leave.user_id },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Send custom message email to employee
    await sendCustomMessageEmail(leave, user, message);

    // Create a notification for that user
    await prisma.notification.create({
      data: {
        user_id: leave.user_id,
        message: `HR sent you a message regarding your leave: ${message}`,
        read: false,
        time: new Date(),
      },
    });

    return res.json({ success: true, message: "Custom message sent to employee." });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};



