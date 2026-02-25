import { Queue } from 'bullmq';
import { redisConfig } from '../config/redis';

export const analyticsQueue = new Queue('analytics-aggregation', {
    connection: redisConfig,
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 1000,
        },
        removeOnComplete: true,
        removeOnFail: false,
    },
});
