import express from "express";
import { createLeave, approveLeave, rejectLeave } from "../controllers/leaveController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/apply", authMiddleware, createLeave);
router.get("/approve/:id", authMiddleware, approveLeave);
router.get("/reject/:id", authMiddleware, rejectLeave);

export default router;
