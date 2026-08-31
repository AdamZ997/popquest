import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import prisma from "../prisma";

export const register = async (req: Request, res: Response) => {
    try {
        const { username, email, password} = req.body;

        //does user exist already
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [{ email }, { username }]
            }
        });

        if(existingUser) {
            res.status(400).json({ error: 'User with this email or username already exists'});
            return;
        }

        //password encryption
        const passwordHash = await bcrypt.hash(password, 10);

        //create user
        const user = await prisma.user.create({
            data: {
                username,
                email,
                passwordHash
            }
        });

        //create JWT token
        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET!,
            { expiresIn: '7d'}
        );

        res.status(201).json({
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                xp: user.xp,
                level: user.level
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server issue' });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        //find user
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if(!user) {
            res.status(401).json({ error: 'Incorrect email or password' });
            return;
        }

        //check password
        const validPassword = await bcrypt.compare(password, user.passwordHash);

        if(!validPassword) {
            res.status(401).json({ error: ' Incorrect email or password' });
            return;
        }

        // create JWT token
        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET!,
            { expiresIn: '7d' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                xp: user.xp,
                level: user.level
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server issue' });
    }
};