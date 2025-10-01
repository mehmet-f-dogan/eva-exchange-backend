import { Model, Table, Column, DataType, PrimaryKey, AutoIncrement } from 'sequelize-typescript';


@Table({ tableName: 'portfolios', timestamps: true })
export class Portfolio extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number;


    @Column({ type: DataType.STRING, allowNull: false })
    ownerName!: string;
}