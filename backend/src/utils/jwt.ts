import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'your_fallback_secret';
const JWT_EXPIRES_IN = '24h';

export const generateToken = (userId: string, role: string) => {
    return jwt.sign({ sub: userId, role }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
    });
};

export const verifyToken = (token: string) => {
    return jwt.verify(token, JWT_SECRET);
};
