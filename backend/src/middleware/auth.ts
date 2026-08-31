import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
    userId?: number;
    userRole?: string;
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'You are not authenticated'});
        return;
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number; role: string };
        req.userId = decoded.userId;
        req.userRole = decoded.role;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Token not valid' });
    }
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.userRole !== 'ADMIN') {
        res.status(403).json({ error: 'Access denied' });
        return;
    }
    next();
};