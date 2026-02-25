import { setupAnalyticsJob } from './src/jobs/analytics.job';
import app from './src/app';
import sequelize from './src/config/database';
import './src/models';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected successfully.');
        await sequelize.sync({ alter: false });
        console.log('Database models synchronized.');

        import('./src/jobs/analytics.worker');
        await setupAnalyticsJob();
        console.log('Background jobs initialized.');


        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        process.exit(1);
    }
};

startServer();
