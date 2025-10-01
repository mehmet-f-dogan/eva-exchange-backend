import { Model, Table, Column, DataType, PrimaryKey, Default } from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';


@Table({ tableName: 'shares', timestamps: true })
export class Share extends Model {
    @PrimaryKey
    @Default(() => uuidv4())
    @Column(DataType.UUID)
    id!: string;


    @Column({
        type: DataType.STRING(3),
        allowNull: false,
        unique: true,
        set(this: Share, val: string) {
            this.setDataValue('symbol', (val || '').toUpperCase());
        },
        validate: {
            is: /^[A-Z]{3}$/,
        }
    })
    symbol!: string;


    @Column({ type: DataType.STRING, allowNull: true })
    name?: string;
}