import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { Article, DailyAnalytics } from '../models';
import { errorResponse, paginatedResponse } from '../utils/response';
import sequelize from '../config/database';

export const getAuthorDashboard = async (req: AuthRequest, res: Response) => {
    try {
        const authorId = req.user?.id;
        const page = parseInt(req.query.page as string) || 1;
        const size = parseInt(req.query.size as string) || 10;
        const offset = (page - 1) * size;

        // For grouped queries, count returns an array. We need the total number of articles.
        const totalCount = await Article.count({ where: { authorId } });

        const rows = await Article.findAll({
            attributes: [
                'id', 'title', 'createdAt',
                [sequelize.fn('COALESCE', sequelize.fn('SUM', sequelize.col('analytics.viewCount')), 0), 'totalViews']
            ],
            where: { authorId },
            include: [{
                model: DailyAnalytics,
                as: 'analytics',
                attributes: [],
                required: false,
            }],
            group: ['Article.id'],
            limit: size,
            offset,
            order: [['createdAt', 'DESC']],
            subQuery: false,
        });

        return res.status(200).json(paginatedResponse('Dashboard metrics fetched successfully', rows, page, size, totalCount));
    } catch (error: any) {
        return res.status(500).json(errorResponse('Internal Server Error', [error.message]));
    }
};
