import { Router } from "express";
import { authenticate, requireAdmin } from "../middleware/auth";
import { getQuizzes, getQuiz, createQuiz, submitQuiz, updateQuiz, deleteQuiz, getAllQuizzes } from "../controllers/quizController";

const router = Router();

router.get('/', authenticate, getQuizzes);
router.get('/all', authenticate, requireAdmin, getAllQuizzes);
router.get('/:id', authenticate, getQuiz);
router.post('/', authenticate, requireAdmin, createQuiz);
router.put('/:id', authenticate, requireAdmin, updateQuiz);
router.delete('/:id', authenticate, requireAdmin, deleteQuiz);
router.post('/:id/submit', authenticate, submitQuiz);

export default router;