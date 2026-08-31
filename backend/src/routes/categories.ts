import { Router } from "express";
import { authenticate, requireAdmin } from "../middleware/auth";
import { getCategories, createCategory, deleteCategory } from "../controllers/categoryController";

const router = Router();

router.get('/', authenticate, getCategories);
router.post('/', authenticate, requireAdmin, createCategory);
router.delete('/:id', authenticate, requireAdmin, deleteCategory);

export default router;