import { Request, Response } from 'express';
import { User } from '../models';
import { generateToken } from '../utils/jwt';
import { successResponse, errorResponse } from '../utils/response';

const STRONG_PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const signup = async (req: Request, res: Response) => {
    try {
        const { name, email, password, role } = req.body;

        // Validation
        if (!name || !email || !password || !role) {
            return res.status(400).json(errorResponse('Missing required fields', ['Name, email, password, and role are mandatory']));
        }

        if (!['author', 'reader'].includes(role)) {
            return res.status(400).json(errorResponse('Invalid role', ['Role must be either author or reader']));
        }

        if (!STRONG_PASSWORD_REGEX.test(password)) {
            return res.status(400).json(errorResponse('Weak password', ['Password must be at least 8 characters long, contains upper case, lower case, number, and special character']));
        }

        // Check for duplicate email
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json(errorResponse('Conflict', ['Email already registered']));
        }

        const user = await User.create({ name, email, password, role });

        return res.status(201).json(successResponse('User registered successfully', { id: user.id, name: user.name, email: user.email, role: user.role }));
    } catch (error: any) {
        return res.status(500).json(errorResponse('Internal Server Error', [error.message]));
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json(errorResponse('Missing credentials', ['Email and password are required']));
        }

        const user = await User.findOne({ where: { email } });
        if (!user || !(await user.validatePassword(password))) {
            return res.status(401).json(errorResponse('Unauthorized', ['Invalid email or password']));
        }

        const token = generateToken(user.id, user.role);

        return res.status(200).json(successResponse('Login successful', { token, role: user.role }));
    } catch (error: any) {
        return res.status(500).json(errorResponse('Internal Server Error', [error.message]));
    }
};
