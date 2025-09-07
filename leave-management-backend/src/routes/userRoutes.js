import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { getMyProfile,changePassword,createUser} from "../controllers/userController.js";



const router = express.Router();

router.get("/me", authMiddleware, getMyProfile);
router.post('/change-password', authMiddleware, changePassword);
router.post('/add', authMiddleware, createUser);


export default router;