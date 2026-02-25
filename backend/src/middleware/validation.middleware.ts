import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';
import { errorResponse } from '../utils/response';

export const validateRequest = (schema: Schema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error } = schema.validate(req.body, { abortEarly: false });

        if (error) {
            const errorMessages = error.details.map((detail) => detail.message);
            return res.status(400).json(errorResponse('Validation Error', errorMessages)); 
        }

        next();
    };
};
