import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { Article, User, ReadLog } from '../models';
import { successResponse, errorResponse, paginatedResponse } from '../utils/response';
import { Op, WhereOptions } from 'sequelize';
import { verifyToken } from '../utils/jwt';

export const createArticle = async (req: AuthRequest, res: Response) => {
    try {
        const { title, content, category, status } = req.body;
        const authorId = req.user?.id;

        if (!title || !content || !category) {
            return res.status(400).json(errorResponse('Missing required fields', ['Title, content, and category are required']));
        }

        const article = await Article.create({
            title,
            content,
            category,
            status: status || 'Draft',
            authorId,
        });

        return res.status(201).json(successResponse('Article created successfully', article));
    } catch (error: any) {
        return res.status(500).json(errorResponse('Internal Server Error', [error.message]));
    }
};

export const getMyArticles = async (req: AuthRequest, res: Response) => {
    try {
        const authorId = req.user?.id;
        const page = parseInt(req.query.page as string) || 1;
        const size = parseInt(req.query.size as string) || 10;
        const offset = (page - 1) * size;

        const { count, rows } = await Article.findAndCountAll({
            where: { authorId },
            limit: size,
            offset,
            order: [['createdAt', 'DESC']],
            paranoid: false, // Authors can see their soft-deleted articles (marked as deleted)
        });

        return res.status(200).json(paginatedResponse('Articles fetched successfully', rows, page, size, count));
    } catch (error: any) {
        return res.status(500).json(errorResponse('Internal Server Error', [error.message]));
    }
};

export const updateArticle = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { title, content, category, status } = req.body;
        const authorId = req.user?.id;

        const article = await Article.findByPk(id as string);

        if (!article) {
            return res.status(404).json(errorResponse('Not Found', ['Article not found']));
        }

        if (article.authorId !== authorId) {
            return res.status(403).json(errorResponse('Forbidden', ["You cannot modify another author's work"]));
        }

        await article.update({ title, content, category, status });

        return res.status(200).json(successResponse('Article updated successfully', article));
    } catch (error: any) {
        return res.status(500).json(errorResponse('Internal Server Error', [error.message]));
    }
};

export const deleteArticle = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const authorId = req.user?.id;

        const article = await Article.findByPk(id as string);

        if (!article) {
            return res.status(404).json(errorResponse('Not Found', ['Article not found']));
        }

        if (article.authorId !== authorId) {
            return res.status(403).json(errorResponse('Forbidden', ["You cannot delete another author's work"]));
        }

        await article.destroy(); // Performs soft delete because paranoid: true in model

        return res.status(200).json(successResponse('Article deleted successfully (soft-deleted)'));
    } catch (error: any) {
        return res.status(500).json(errorResponse('Internal Server Error', [error.message]));
    }
};

export const getArticles = async (req: Request, res: Response) => {
    try {
        const { category, author, q, page, size } = req.query;
        const pageNum = Math.max(1, parseInt(page as string) || 1);
        const pageSize = Math.min(100, Math.max(1, parseInt(size as string) || 10));
        const offset = (pageNum - 1) * pageSize;

        const where: WhereOptions = { status: 'Published' };

        if (category) where.category = category;
        if (q) where.title = { [Op.iLike]: `%${q}%` };

        const include: any[] = [{
            model: User,
            as: 'author',
            attributes: ['id', 'name', 'email'],
            ...(author && {
                where: { name: { [Op.iLike]: `%${author}%` } },
                required: true,
            }),
        }];

        const { count, rows } = await Article.findAndCountAll({
            where,
            include,
            limit: pageSize,
            offset,
            order: [['createdAt', 'DESC']],
        });

        return res.status(200).json(paginatedResponse('Articles fetched successfully', rows, pageNum, pageSize, count));
    } catch (error: any) {
        return res.status(500).json(errorResponse('Internal Server Error', [error.message]));
    }
};

export const getArticleById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const article = await Article.findByPk(id as string);

        if (!article) {
            return res.status(404).json(errorResponse('Not Found', ['News article no longer available']));
        }

        // Capture ReaderId if present in JWT
        let readerId: string | null = null;
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            try {
                const decoded = verifyToken(token) as any;
                readerId = decoded.sub;
            } catch (err) {
                // Guest read if token is invalid
            }
        }

        // Non-blocking read tracking
        ReadLog.create({
            articleId: article.id,
            readerId: readerId,
        }).catch((err) => console.error('Error tracking read event:', err));

        return res.status(200).json(successResponse('Article fetched successfully', article));
    } catch (error: any) {
        return res.status(500).json(errorResponse('Internal Server Error', [error.message]));
    }
};
