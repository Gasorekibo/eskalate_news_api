import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

export enum ArticleStatus {
    DRAFT = 'Draft',
    PUBLISHED = 'Published',
}

class Article extends Model {
    public id!: string;
    public title!: string;
    public content!: string;
    public category!: string;
    public status!: ArticleStatus;
    public authorId!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public deletedAt!: Date | null;
}

Article.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING(150),
            allowNull: false,
            validate: {
                len: [1, 150],
            },
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                len: [50, 1000000],
            },
        },
        category: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM(...Object.values(ArticleStatus)),
            defaultValue: ArticleStatus.DRAFT,
            allowNull: false,
        },
        authorId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id',
            },
        },
    },
    {
        sequelize,
        modelName: 'Article',
        paranoid: true,
    }
);

export default Article;
