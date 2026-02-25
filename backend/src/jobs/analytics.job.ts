import { analyticsQueue } from './analytics.queue';

// Schedule the daily aggregation job
// BullMQ uses cron expressions for repeatable jobs
export const setupAnalyticsJob = async () => {
    console.log('Setting up BullMQ Daily Analytics Job (GMT)...');

    // Day starts at 00:00 GMT, we run at 00:05 AM GMT
    // '5 0 * * *' is the cron for 00:05
    await analyticsQueue.add(
        'daily-aggregation',
        {},
        {
            repeat: {
                pattern: '5 0 * * *',
            },
            jobId: 'daily-analytics-job',
        }
    );

    console.log('Daily Analytics Job scheduled via BullMQ.');
};

// Manual trigger for testing/initial run if needed
export const runAggregationForDate = async (dateStr: string) => {
    try {
        await analyticsQueue.add('manual-aggregation', { date: dateStr });
        console.log(`Manual aggregation job added to queue for date: ${dateStr}`);
        return true;
    } catch (error) {
        console.error('Manual Aggregation Queue Error:', error);
        return false;
    }
};
