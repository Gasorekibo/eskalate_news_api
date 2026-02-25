import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class ReadLog extends Model {
    public id!: string;
    public articleId!: string;
    public readerId!: string | null;
    public readonly readAt!: Date;
}

ReadLog.init(
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
        readerId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'Users',
                key: 'id',
            },
        },
        readAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        modelName: 'ReadLog',
        timestamps: false,
    }
);

export default ReadLog;
