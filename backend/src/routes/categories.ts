import { Router } from "express";
import { authenticate, requireAdmin } from "../middleware/auth";
import { getCategories, createCategory, deleteCategory, updateCategory } from "../controllers/categoryController";

const router = Router();

router.get('/', authenticate, getCategories);
router.post('/', authenticate, requireAdmin, createCategory);
router.put('/:id', authenticate, requireAdmin, updateCategory);
router.delete('/:id', authenticate, requireAdmin, deleteCategory);

export default router;