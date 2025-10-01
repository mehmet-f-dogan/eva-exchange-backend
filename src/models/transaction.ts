import { Model, Table, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Portfolio } from './portfolio';
import { Share } from './share';


export enum TradeType {
    BUY = 'BUY',
    SELL = 'SELL'
}


@Table({ tableName: 'transactions', timestamps: true, underscored: true  })
export class Transaction extends Model {
    @ForeignKey(() => Portfolio)
    @Column({ type: DataType.INTEGER, allowNull: false })
    portfolioId!: number;


    @BelongsTo(() => Portfolio)
    portfolio?: Portfolio;


    @ForeignKey(() => Share)
    @Column({ type: DataType.UUID, allowNull: false })
    shareId!: string;


    @BelongsTo(() => Share)
    share?: Share;


    @Column({ type: DataType.ENUM('BUY', 'SELL'), allowNull: false })
    type!: TradeType;


    @Column({ type: DataType.INTEGER, allowNull: false, validate: { min: 1 } })
    quantity!: number;


    @Column({ type: DataType.DECIMAL(12, 2), allowNull: false })
    price!: string;
}