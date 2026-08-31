import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import prisma from "../prisma";

export const getMe = async (req: AuthRequest, res: Response) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.userId }
        });

        if (!user) {
            res.status(404).json({ error: 'User not found'});
            return;
        }

        res.json({
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            xp: user.xp,
            level: user.level,
            createdAt: user.createdAt
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server issue'});
    }
};

export const getAttempts = async (req: AuthRequest, res: Response) => {
    try {
        const attempts = await prisma.quizAttempt.findMany({
            where: { userId: req.userId },
            include: {
                quiz: {
                    include: {
                        category: true
                    }
                }
            },
            orderBy: { completedAt: 'desc' }
        });

        res.json(attempts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server issue' });
    }
};