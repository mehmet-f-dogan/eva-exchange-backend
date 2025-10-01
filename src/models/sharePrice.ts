import { Model, Table, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Share } from './share';


@Table({ tableName: 'share_prices', timestamps: true })
export class SharePrice extends Model {
    @ForeignKey(() => Share)
    @Column({ type: DataType.UUID, allowNull: false })
    shareId!: string;


    @BelongsTo(() => Share)
    share?: Share;


    @Column({
        type: DataType.DECIMAL(12, 2),
        allowNull: false,
        validate: {
            isDecimal: true,
        }
    })
    price!: string;


    @Column({ type: DataType.DATE, allowNull: false, defaultValue: DataType.NOW })
    timestamp!: Date;
}