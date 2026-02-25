import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { errorResponse } from '../utils/response';

export interface AuthRequest extends Request {
    user?: {
        id: string;
        role: string;
    };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json(errorResponse('Unauthorized', ['Access token is missing or invalid']));
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = verifyToken(token) as any;
        req.user = {
            id: decoded.sub,
            role: decoded.role,
        };
        next();
    } catch (error) {
        return res.status(401).json(errorResponse('Unauthorized', ['Invalid or expired token']));
    }
};
