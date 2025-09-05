import express from "express";
import { createLeave, approveLeave, rejectLeave, getMyLeaves, getUserStats , getAllLeaveRequests , handleLeaveAction,
    getAllLeavesWithHistory,withdrawLeaveRequest,getRemainingLeaves,submitEncashment} from "../controllers/leaveController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { sendCustomLeaveMessage } from "../controllers/leaveController.js";

const router = express.Router();




// Existing routes
router.get("/my", authMiddleware, getMyLeaves);
router.post("/create", authMiddleware, createLeave);
router.get("/stats", authMiddleware, getUserStats);
router.post("/reject/:id", authMiddleware, rejectLeave);
router.post("/approve/:id", authMiddleware, approveLeave);
router.get("/all", authMiddleware, getAllLeaveRequests);
router.get("/action", handleLeaveAction);
router.get("/history/all", authMiddleware, getAllLeavesWithHistory);
router.put("/requests/:id/withdraw", authMiddleware, withdrawLeaveRequest);
router.post("/requests/:id/message", authMiddleware, sendCustomLeaveMessage);
router.get("/remaining", authMiddleware, getRemainingLeaves);
router.post("/encashment", authMiddleware, submitEncashment);

export default router;