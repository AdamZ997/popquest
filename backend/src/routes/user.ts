import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { getMe, getAttempts } from "../controllers/userController";

const router = Router();

router.get('/me', authenticate, getMe);
router.get('/attempts', authenticate, getAttempts);

export default router;