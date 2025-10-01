import { Sequelize } from 'sequelize-typescript';
import { Share } from './share';
import { SharePrice } from './sharePrice';
import { Portfolio } from './portfolio';
import { Transaction, TradeType } from './transaction';


const env = process.env.NODE_ENV || 'development';


let sequelize: Sequelize;


if (env === 'test') {
    sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: ':memory:',
        logging: false,
    });
} else {
    const dbUrl = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/evaexchange';
    sequelize = new Sequelize(dbUrl, {
        models: [Share, SharePrice, Portfolio, Transaction],
        logging: false,
    });
}


sequelize.addModels([Share, SharePrice, Portfolio, Transaction]);


export { sequelize, Share, SharePrice, Portfolio, Transaction, TradeType };