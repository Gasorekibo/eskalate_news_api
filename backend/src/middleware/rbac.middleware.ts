import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';
import { errorResponse } from '../utils/response';

export const rbacMiddleware = (allowedRoles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json(errorResponse('Unauthorized', ['User not authenticated']));
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json(errorResponse('Forbidden', [`Access restricted to: ${allowedRoles.join(', ')}`]));
        }

        next();
    };
};
