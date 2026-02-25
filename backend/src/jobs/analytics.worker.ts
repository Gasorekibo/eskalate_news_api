import { Worker, Job } from 'bullmq';
import { redisConfig } from '../config/redis';
import { ReadLog, DailyAnalytics } from '../models';
import sequelize from '../config/database';
import { Op } from 'sequelize';

export const analyticsWorker = new Worker(
    'analytics-aggregation',
    async (job: Job) => {
        console.log(`Processing analytics aggregation for job: ${job.id}`);

        // Use the date provided in the job data, or default to yesterday
        const dateStr = job.data?.date || (() => {
            const yesterday = new Date();
            yesterday.setUTCDate(yesterday.getUTCDate() - 1);
            return yesterday.toISOString().split('T')[0];
        })();

        console.log(`Aggregating data for date: ${dateStr} (GMT)`);

        try {
            // Aggregate counts by ArticleId for that date
            const stats = await ReadLog.findAll({
                attributes: [
                    'articleId',
                    [sequelize.fn('COUNT', sequelize.col('id')), 'viewCount']
                ],
                where: {
                    readAt: {
                        [Op.gte]: new Date(`${dateStr}T00:00:00.000Z`),
                        [Op.lt]: new Date(`${dateStr}T23:59:59.999Z`),
                    }
                },
                group: ['articleId'],
                raw: true
            });

            for (const stat of (stats as any)) {
                await DailyAnalytics.upsert({
                    articleId: stat.articleId,
                    date: dateStr,
                    viewCount: parseInt(stat.viewCount)
                });
            }

            console.log(`Successfully aggregated analytics for ${dateStr}. Processing ${stats.length} articles.`);
            return { processed: stats.length, date: dateStr };
        } catch (error) {
            console.error(`Error in Analytics Worker for date ${dateStr}:`, error);
            throw error;
        }
    },
    { connection: redisConfig }
);

analyticsWorker.on('completed', (job) => {
    console.log(`Job ${job.id} completed!`);
});

analyticsWorker.on('failed', (job, err) => {
    console.error(`Job ${job?.id} failed with error: ${err.message}`);
});
