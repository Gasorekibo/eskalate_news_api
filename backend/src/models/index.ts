import User from './User';
import Article from './Article';
import ReadLog from './ReadLog';
import DailyAnalytics from './DailyAnalytics';

// MODELS ASSOCIATIONS 

User.hasMany(Article, { foreignKey: 'authorId', as: 'articles' });
Article.belongsTo(User, { foreignKey: 'authorId', as: 'author' });

Article.hasMany(ReadLog, { foreignKey: 'articleId', as: 'readLogs' });
ReadLog.belongsTo(Article, { foreignKey: 'articleId', as: 'article' });

User.hasMany(ReadLog, { foreignKey: 'readerId', as: 'reads' });
ReadLog.belongsTo(User, { foreignKey: 'readerId', as: 'reader' });

Article.hasMany(DailyAnalytics, { foreignKey: 'articleId', as: 'analytics' });
DailyAnalytics.belongsTo(Article, { foreignKey: 'articleId', as: 'article' });

export { User, Article, ReadLog, DailyAnalytics };
