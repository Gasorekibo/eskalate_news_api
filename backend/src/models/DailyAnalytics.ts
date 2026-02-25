import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class DailyAnalytics extends Model {
    public id!: string;
    public articleId!: string;
    public viewCount!: number;
    public date!: Date;
}

DailyAnalytics.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        articleId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'Articles',
                key: 'id',
            },
        },
        viewCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'DailyAnalytics',
        indexes: [
            {
                unique: true,
                fields: ['articleId', 'date'],
            },
        ],
    }
);

export default DailyAnalytics;
