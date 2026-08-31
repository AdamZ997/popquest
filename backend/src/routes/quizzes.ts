import { Router } from "express";
import { authenticate, requireAdmin } from "../middleware/auth";
import { getQuizzes, getQuiz, createQuiz, submitQuiz } from "../controllers/quizController";

const router = Router();

router.get('/', authenticate, getQuizzes);
router.get('/:id', authenticate, getQuiz);
router.post('/', authenticate, requireAdmin, createQuiz);
router.post('/:id/submit', authenticate, submitQuiz);

export default router;