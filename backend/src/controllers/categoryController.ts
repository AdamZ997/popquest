import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth";
import prisma from "../prisma";

//every user can see categories
export const getCategories = async (req: AuthRequest, res: Response) => {
    try {
        const categories = await prisma.category.findMany({
            orderBy: { minLevel: 'asc' }
        });
        res.json(categories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server issue'});
    }
};

//only admin can make categories
export const createCategory = async (req: Request, res: Response) => {
    try {
        const { name, icon, description, minLevel } = req.body;

        const category = await prisma.category.create({
            data: { name, icon, description, minLevel }
        });

        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ error: 'Server issue'});
    }
};

//only admin can remove categories
export const deleteCategory = async (req: Request, res: Response) => {
    try{
        const { id } = req.params;

        //finding all quizzes with this category
        const quizzes = await prisma.quiz.findMany({
            where: { categoryId: Number(id) }
        });

        //delete all data connected each quiz
        for (const quiz of quizzes) {
            //attempts
            await prisma.quizAttempt.deleteMany({
                where: { quizId: quiz.id }
            });

            //find all questions
            const questions = await prisma.question.findMany({
                where: { quizId: quiz.id }
            });

            //delete answers for each question
            for (const question of questions) {
                await prisma.answer.deleteMany({
                    where: { questionId: question.id }
                });
            }

            //delete questions
            await prisma.question.deleteMany({
                where: { quizId: quiz.id }
            });
        }

        //delete quizzes
        await prisma.quiz.deleteMany({
            where: { categoryId: Number(id) }
        });
        
        //delete category
        await prisma.category.delete({
            where: { id: Number(id) }
        });

        res.json({ message: 'Category and all connected quizzes are removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server issue'});
    }
};

//only admin can update categories

export const updateCategory = async (req: Request, res: Response) => {
    try{
        const { id } = req.params;
        const { name, icon, description, minLevel } = req.body;

        const category = await prisma.category.update({
            where: { id: Number(id) },
            data: { name, icon, description, minLevel }
        });

        res.json(category);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server issue'});
    }
};