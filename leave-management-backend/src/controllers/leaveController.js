import { applyLeave, updateLeaveStatus } from "../services/leaveService.js";
import prisma from "../../prisma/client.js";

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

export const approveLeave = async (req, res) => {
  try {
    const leave = await updateLeaveStatus(req.params.id, "approved");

    if (!leave) {
      return res.status(404).send("Leave not found");
    }
    // Sending HTML markup as string (Express does not support JSX directly)
    res.send("<h2>Leave Approved ✅</h2>");
  } catch (err) {
    res.status(500).send("Error approving leave");
  }
};

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