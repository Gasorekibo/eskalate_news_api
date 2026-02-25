import Joi from 'joi';

export const signupSchema = Joi.object({
    name: Joi.string().pattern(/^[a-zA-Z\s]+$/).required().messages({
        'string.pattern.base': 'Name must contain only alphabets and spaces',
    }),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/).required().messages({
        'string.pattern.base': 'Password must be at least 8 characters long, contains upper case, lower case, number, and special character',
    }),
    role: Joi.string().valid('author', 'reader').required(),
});

export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

export const articleSchema = Joi.object({
    title: Joi.string().min(1).max(150).required(),
    content: Joi.string().min(50).required(),
    category: Joi.string().required(),
    status: Joi.string().valid('Draft', 'Published').optional(),
});
