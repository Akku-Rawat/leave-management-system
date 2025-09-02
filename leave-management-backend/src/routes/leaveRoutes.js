import express from "express";
import { createLeave, approveLeave, rejectLeave, getMyLeaves, getUserStats , getAllLeaveRequests} from "../controllers/leaveController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();




// Existing routes
router.get("/my", authMiddleware, getMyLeaves);
router.post("/create", authMiddleware, createLeave);
router.get("/stats", authMiddleware, getUserStats);
router.post("/reject/:id", authMiddleware, rejectLeave);
router.post("/approve/:id", authMiddleware, approveLeave);
router.get("/all", authMiddleware, getAllLeaveRequests);


export default router;
