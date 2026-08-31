import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth";
import prisma from "../prisma";

//user can see quizzes available for their level
export const getQuizzes = async (req: AuthRequest, res: Response) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.userId }
        });

        const quizzes = await prisma.quiz.findMany({
            where: { minLevel: { lte: user!.level }},
            include: { category: true },
            orderBy: { createdAt: 'desc' }
        });

        res.json(quizzes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server issue'});
    }
};

//one quiz with all questions and answers
export const getQuiz = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        const quiz = await prisma.quiz.findUnique({
            where: { id: Number(id) },
            include: {
                category: true,
                questions: {
                    orderBy: { order: 'asc' },
                    include: { answers: true }
                }
            }
        });

        if(!quiz) {
            res.status(404).json({ error: 'Quiz not found' });
            return;
        }

        //check if user has high enough level
        const user = await prisma.user.findUnique({
            where: { id: req.userId }
        });

        if(user!.level < quiz.minLevel) {
            res.status(403).json({ error: 'Quiz is not available for your level'})
            return
        }

        res.json(quiz)
    } catch(error) {
        console.error(error);
        res.status(500).json({ error: 'Server issue'});
    }
};

//only admin can make a quiz
export const createQuiz = async (req: Request, res: Response) => {
    try {
        const { title, description, categoryId, minLevel, xpReward, questions } = req.body;

        const quiz = await prisma.quiz.create({
            data: {
                title,
                description,
                categoryId,
                minLevel,
                xpReward,
                questions: {
                    create: questions.map((q: any, index: number) => ({
                        questionText: q.questionText,
                        order: index + 1,
                        answers: {
                            create: q.answers.map((a: any) => ({
                                answerText: a.answerText,
                                isCorrect: a.isCorrect
                            }))
                        }
                    }))
                }
            },
            include: {
                questions: {
                    include: { answers: true }
                }
            }
        });

        res.status(201).json(quiz);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server issue'})
    }
};

//user gives answers and gets xp
export const submitQuiz = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { answers } = req.body;

        const quiz = await prisma.quiz.findUnique({
            where: { id: Number(id) },
            include: {
                questions: {
                    include: { answers: true}
                }
            }
        });

        if (!quiz) {
            res.status(404).json({ error: 'Quiz not found' });
            return;
        }

        //calculate result
        let correctCount = 0;
        quiz.questions.forEach((question) => {
            const correctAnswer = question.answers.find((a) => a.isCorrect);
            const userAnswer = answers[question.id];
            if (correctAnswer && userAnswer === correctAnswer.id) {
                correctCount++;
            }
        });

        const totalQuestions = quiz.questions.length;
        const score = Math.round((correctCount / totalQuestions) * 100);
        const xpEarned = Math.round((score / 100) * quiz.xpReward);

        //save attempt
        await prisma.quizAttempt.create({
            data: {
                userId: req.userId!,
                quizId: quiz.id,
                score,
                xpEarned
            }
        });

        //update XP and user level
        const user = await prisma.user.findUnique({
            where: { id: req.userId }
        });

        const newXp = user!.xp + xpEarned;
        const newLevel = Math.floor(newXp / 500) + 1;

        await prisma.user.update({
            where: { id: req.userId },
            data: {
                xp: newXp,
                level: newLevel > 5 ? 5 : newLevel
            }
        });

        res.json({
            score,
            correctCount,
            totalQuestions,
            xpEarned,
            newXp,
            newLevel: newLevel > 5 ? 5 : newLevel
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server issue'})
    }
};