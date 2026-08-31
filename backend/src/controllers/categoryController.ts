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

        await prisma.category.delete({
            where: { id: Number(id) }
        });

        res.json({ message: 'Category removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server issue'});
    }
};