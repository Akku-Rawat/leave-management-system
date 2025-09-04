import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { getType1Notifications,getType2Notifications,getType3Notifications } from "../controllers/notificationController.js";

const router = express.Router();

router.get("/type1", authMiddleware, getType1Notifications);
router.get("/type2", authMiddleware, getType2Notifications);
router.get("/type3", authMiddleware, getType3Notifications);

export default router;